const DEFAULT_SETTINGS = {
    targetLanguage: "ko",
    badgeSize: 12,
    badgeColor: "#000000",
    badgeColorAlpha: 80,
    badgeTextColor: "#ffffff",
    badgeTextColorAlpha: 100,
    badgeRadius: 2,
    unifyRegionalVariants: true,
};

let settings = { ...DEFAULT_SETTINGS };
const badgeClass = "yt-caption-checker-badge";
const processedAnchors = new WeakMap();
const LOG_PREFIX = "[YT Caption Checker]";
const captionCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 10;
const inFlightCaptionRequests = new Map();

init();

async function init() {
    settings = await loadSettings();
    injectStyle();
    scanAndRender();
    observeMutations();
    console.info(`${LOG_PREFIX} initialized`, settings);

    chrome.storage.onChanged.addListener(async (changes, areaName) => {
        if (areaName !== "sync") {
            return;
        }

        if (
            changes.targetLanguage ||
            changes.badgeSize ||
            changes.badgeColor ||
            changes.badgeColorAlpha ||
            changes.badgeTextColor ||
            changes.badgeTextColorAlpha ||
            changes.badgeRadius ||
            changes.unifyRegionalVariants
        ) {
            settings = await loadSettings();
            scanAndRender(true);
        }
    });
}

function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
            resolve({ ...DEFAULT_SETTINGS, ...result });
        });
    });
}

function injectStyle() {
    const existing = document.getElementById("yt-caption-checker-style");
    if (existing) {
        return;
    }

    const style = document.createElement("style");
    style.id = "yt-caption-checker-style";
    style.textContent = `
    .${badgeClass} {
      position: absolute;
      top: 6px;
            left: 6px;
            z-index: 10;
    font-weight: 500;
    border-radius: ${settings.badgeRadius}px;
    padding: 1px 4px;
        color: ${toRgba(settings.badgeTextColor, settings.badgeTextColorAlpha)};
    background: ${toRgba(settings.badgeColor, settings.badgeColorAlpha)};
    box-shadow: none;
      pointer-events: none;
    line-height: 1.2;
    letter-spacing: 0;
      font-size: ${settings.badgeSize}px;
    }
  `;
    document.head.appendChild(style);
}

function observeMutations() {
    const observer = new MutationObserver(() => {
        scanAndRender();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

function scanAndRender(force = false) {
    updateStyleVars();

    const anchors = collectThumbnailAnchors();

    if (anchors.length === 0) {
        console.debug(`${LOG_PREFIX} no thumbnail anchors found on`, location.pathname);
        return;
    }

    console.debug(`${LOG_PREFIX} scan anchors=${anchors.length} force=${force}`);

    for (const anchor of anchors) {
        if (!isTargetThumbnail(anchor)) {
            continue;
        }

        const videoId = extractVideoId(anchor.href);
        if (!videoId) {
            continue;
        }

        if (!force && processedAnchors.get(anchor) === videoId) {
            continue;
        }

        processedAnchors.set(anchor, videoId);
        ensureRelativePosition(anchor);
        requestAndRenderBadge(anchor, videoId);
    }
}

function isTargetThumbnail(anchor) {
    if (!anchor) {
        return false;
    }

    if (anchor.id === "thumbnail") {
        return true;
    }

    return Boolean(anchor.querySelector(":scope > div.yt-thumbnail-view-model"));
}

function collectThumbnailAnchors() {
    const directAnchors = Array.from(document.querySelectorAll("a#thumbnail"));
    const modelDivAnchors = Array.from(document.querySelectorAll("a > div.yt-thumbnail-view-model"))
        .map((div) => div.closest("a"))
        .filter(Boolean);
    const watchAnchors = Array.from(document.querySelectorAll("a[href*='watch?v=']"));

    const uniq = new Set([...directAnchors, ...modelDivAnchors, ...watchAnchors]);
    return Array.from(uniq).filter((anchor) => {
        const href = anchor.getAttribute("href") || "";
        return !href.includes("/shorts/");
    });
}

function ensureRelativePosition(anchor) {
    const style = window.getComputedStyle(anchor);
    if (style.position === "static") {
        anchor.style.setProperty("position", "relative", "important");
    }
}

function requestAndRenderBadge(anchor, videoId) {
    resolveCaptionTracks(videoId)
        .then((tracks) => {
            applyBadgeByTracks(anchor, tracks, settings.targetLanguage);
        })
        .catch((error) => {
            console.warn(`${LOG_PREFIX} caption fetch failed for ${videoId}`, error);
            removeBadge(anchor);
        });
}

function isExtensionContextValid() {
    try {
        return Boolean(chrome?.runtime?.id);
    } catch {
        return false;
    }
}

async function resolveCaptionTracks(videoId) {
    const inFlight = inFlightCaptionRequests.get(videoId);
    if (inFlight) {
        return inFlight;
    }

    const task = resolveCaptionTracksInternal(videoId);
    inFlightCaptionRequests.set(videoId, task);

    try {
        return await task;
    } finally {
        inFlightCaptionRequests.delete(videoId);
    }
}

async function resolveCaptionTracksInternal(videoId) {
    const now = Date.now();
    const cached = captionCache.get(videoId);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        return cached.tracks;
    }

    const fromRuntime = await fetchCaptionsViaRuntime(videoId);
    if (fromRuntime.length > 0) {
        setCachedTracks(videoId, fromRuntime);
        return fromRuntime;
    }

    const fromTimedText = await fetchCaptionsDirect(videoId);
    if (fromTimedText.length > 0) {
        setCachedTracks(videoId, fromTimedText);
        return fromTimedText;
    }

    const fromWatchPage = await fetchCaptionsFromWatchPage(videoId);
    setCachedTracks(videoId, fromWatchPage);
    return fromWatchPage;
}

function setCachedTracks(videoId, tracks) {
    captionCache.set(videoId, {
        timestamp: Date.now(),
        tracks,
    });
}

function fetchCaptionsViaRuntime(videoId) {
    if (!isExtensionContextValid()) {
        return Promise.resolve([]);
    }

    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage({ type: "GET_CAPTIONS", videoId }, (response) => {
                if (chrome.runtime.lastError || !response?.ok) {
                    resolve([]);
                    return;
                }
                resolve(Array.isArray(response.tracks) ? response.tracks : []);
            });
        } catch {
            resolve([]);
        }
    });
}

function applyBadgeByTracks(anchor, tracks, targetLanguage) {
    const hasTarget = hasMatchingCaption(tracks, targetLanguage, settings.unifyRegionalVariants);

    if (hasTarget) {
        upsertBadge(anchor, targetLanguage);
    } else {
        removeBadge(anchor);
    }
}

async function fetchCaptionsDirect(videoId) {
    const endpoint = `https://www.youtube.com/api/timedtext?type=list&v=${encodeURIComponent(videoId)}`;
    const response = await fetch(endpoint, {
        method: "GET",
        credentials: "omit",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseTracksFromXml(xml);
}

async function fetchCaptionsFromWatchPage(videoId) {
    const response = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
        method: "GET",
        credentials: "omit",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`watch page HTTP ${response.status}`);
    }

    const html = await response.text();
    const playerResponseJson = extractJsonObject(html, "ytInitialPlayerResponse = ");
    if (!playerResponseJson) {
        return [];
    }

    try {
        const playerResponse = JSON.parse(playerResponseJson);
        const captionTracks =
            playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

        return captionTracks
            .map((track) => ({
                langCode: String(track?.languageCode || "").toLowerCase(),
            }))
            .filter((track) => track.langCode.length > 0);
    } catch {
        return [];
    }
}

function extractJsonObject(text, marker) {
    const markerIndex = text.indexOf(marker);
    if (markerIndex < 0) {
        return null;
    }

    const start = text.indexOf("{", markerIndex + marker.length);
    if (start < 0) {
        return null;
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i += 1) {
        const ch = text[i];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (ch === "\\") {
                escaped = true;
            } else if (ch === '"') {
                inString = false;
            }
            continue;
        }

        if (ch === '"') {
            inString = true;
            continue;
        }

        if (ch === "{") {
            depth += 1;
            continue;
        }

        if (ch === "}") {
            depth -= 1;
            if (depth === 0) {
                return text.slice(start, i + 1);
            }
        }
    }

    return null;
}

function hasMatchingCaption(tracks, targetLanguage, unifyRegionalVariants) {
    if (!targetLanguage) {
        return false;
    }

    const normalizedTarget = targetLanguage.toLowerCase().trim();
    if (!normalizedTarget) {
        return false;
    }

    if (unifyRegionalVariants) {
        const targetBase = normalizedTarget.split("-")[0];
        return tracks.some((track) => track.langCode.split("-")[0] === targetBase);
    }

    return tracks.some((track) => track.langCode === normalizedTarget);
}

function upsertBadge(anchor, language) {
    let badge = anchor.querySelector(`:scope > .${badgeClass}`);

    if (!badge) {
        badge = document.createElement("span");
        badge.className = badgeClass;
        anchor.appendChild(badge);
    }

    badge.textContent = `CC ${String(language).toUpperCase()}`;
    badge.style.background = toRgba(settings.badgeColor, settings.badgeColorAlpha);
    badge.style.color = toRgba(settings.badgeTextColor, settings.badgeTextColorAlpha);
    badge.style.borderRadius = `${settings.badgeRadius}px`;
    badge.style.fontSize = `${settings.badgeSize}px`;
}

function removeBadge(anchor) {
    const badge = anchor.querySelector(`:scope > .${badgeClass}`);
    if (badge) {
        badge.remove();
    }
}

function updateStyleVars() {
    const style = document.getElementById("yt-caption-checker-style");
    if (!style) {
        return;
    }

    style.textContent = `
    .${badgeClass} {
      position: absolute !important;
      top: 6px;
            left: 6px;
            z-index: 10 !important;
    font-weight: 500;
    border-radius: ${settings.badgeRadius}px;
    padding: 1px 4px;
        color: ${toRgba(settings.badgeTextColor, settings.badgeTextColorAlpha)} !important;
    background: ${toRgba(settings.badgeColor, settings.badgeColorAlpha)};
    box-shadow: none;
      pointer-events: none;
    line-height: 1.2;
    letter-spacing: 0;
      font-size: ${settings.badgeSize}px;
      display: inline-block !important;
      white-space: nowrap;
      transform: translateZ(0);
    }
  `;
}

function parseTracksFromXml(xmlText) {
    if (!xmlText?.trim()) {
        return [];
    }

    const tracks = [];
    const trackTagRegex = /<track\b([^>]*)\/?\s*>/gi;
    let match;

    while ((match = trackTagRegex.exec(xmlText)) !== null) {
        const attrsText = match[1] || "";
        const langCode = readXmlAttr(attrsText, "lang_code");
        if (!langCode) {
            continue;
        }

        tracks.push({
            langCode: langCode.toLowerCase(),
        });
    }

    return tracks;
}

function readXmlAttr(attrsText, attrName) {
    const attrRegex = new RegExp(`${attrName}="([^"]*)"`, "i");
    const match = attrsText.match(attrRegex);
    return match?.[1] || "";
}

function toRgba(hexColor, alphaPercent) {
    const hex = String(hexColor || "").replace("#", "").trim();
    const alpha = Math.max(0, Math.min(100, Number(alphaPercent) || 0)) / 100;

    if (hex.length !== 3 && hex.length !== 6) {
        return `rgba(0, 0, 0, ${alpha})`;
    }

    const normalized = hex.length === 3
        ? hex
            .split("")
            .map((ch) => ch + ch)
            .join("")
        : hex;

    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function extractVideoId(rawHref) {
    if (!rawHref) {
        return null;
    }

    try {
        const url = new URL(rawHref, window.location.origin);

        if (url.pathname === "/watch") {
            return url.searchParams.get("v");
        }

        if (url.hostname === "youtu.be") {
            return url.pathname.replace("/", "") || null;
        }
    } catch {
        return null;
    }

    return null;
}
