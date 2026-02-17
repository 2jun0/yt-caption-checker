const captionCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60;
const CACHE_KEY_PREFIX = "caption_cache:";
const inFlightRequests = new Map();

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "GET_CAPTIONS" || !message.videoId) {
        return false;
    }

    getCaptions(message.videoId)
        .then((tracks) => sendResponse({ ok: true, tracks }))
        .catch((error) => {
            console.error("[YT Caption Checker] caption fetch failed", error);
            sendResponse({ ok: false, tracks: [] });
        });

    return true;
});

async function getCaptions(videoId) {
    const inFlight = inFlightRequests.get(videoId);
    if (inFlight) {
        return inFlight;
    }

    const task = getCaptionsInternal(videoId);
    inFlightRequests.set(videoId, task);

    try {
        return await task;
    } finally {
        inFlightRequests.delete(videoId);
    }
}

async function getCaptionsInternal(videoId) {
    const now = Date.now();
    const cached = captionCache.get(videoId);

    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
        return cached.tracks;
    }

    const persisted = await getPersistedCache(videoId);
    if (persisted && now - persisted.timestamp < CACHE_TTL_MS) {
        captionCache.set(videoId, persisted);
        return persisted.tracks;
    }

    const endpoint = `https://www.youtube.com/api/timedtext?type=list&v=${encodeURIComponent(videoId)}`;
    const response = await fetch(endpoint, { method: "GET" });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const tracks = parseTracks(xml);

    captionCache.set(videoId, {
        timestamp: now,
        tracks,
    });
    persistCache(videoId, { timestamp: now, tracks });

    return tracks;
}

function getPersistedCache(videoId) {
    return new Promise((resolve) => {
        const key = `${CACHE_KEY_PREFIX}${videoId}`;
        chrome.storage.local.get([key], (result) => {
            resolve(result?.[key] || null);
        });
    });
}

function persistCache(videoId, payload) {
    const key = `${CACHE_KEY_PREFIX}${videoId}`;
    chrome.storage.local.set({ [key]: payload });
}

function parseTracks(xmlText) {
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
            langOriginal: langCode,
            langName: decodeXmlEntities(readXmlAttr(attrsText, "name") || ""),
        });
    }

    return tracks;
}

function readXmlAttr(attrsText, attrName) {
    const attrRegex = new RegExp(`${attrName}="([^"]*)"`, "i");
    const match = attrsText.match(attrRegex);
    return match?.[1] || "";
}

function decodeXmlEntities(value) {
    return value
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&");
}
