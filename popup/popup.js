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

const LANGUAGE_OPTIONS = [
    { value: "ko", label: "한국어 (ko)", regional: false },
    { value: "en", label: "영어 (en)", regional: false },
    { value: "en-US", label: "영어 - 미국 (en-US)", regional: true },
    { value: "en-GB", label: "영어 - 영국 (en-GB)", regional: true },
    { value: "ja", label: "일본어 (ja)", regional: false },
    { value: "zh-Hans", label: "중국어(간체) (zh-Hans)", regional: true },
    { value: "zh-Hant", label: "중국어(번체) (zh-Hant)", regional: true },
    { value: "es", label: "스페인어 (es)", regional: false },
    { value: "fr", label: "프랑스어 (fr)", regional: false },
    { value: "de", label: "독일어 (de)", regional: false },
];

const targetLanguageEl = document.getElementById("targetLanguage");
const badgeSizeEl = document.getElementById("badgeSize");
const badgeSizeValueEl = document.getElementById("badgeSizeValue");
const badgeColorEl = document.getElementById("badgeColor");
const badgeColorAlphaEl = document.getElementById("badgeColorAlpha");
const badgeColorAlphaValueEl = document.getElementById("badgeColorAlphaValue");
const badgeTextColorEl = document.getElementById("badgeTextColor");
const badgeTextColorAlphaEl = document.getElementById("badgeTextColorAlpha");
const badgeTextColorAlphaValueEl = document.getElementById("badgeTextColorAlphaValue");
const unifyRegionalVariantsEl = document.getElementById("unifyRegionalVariants");
const statusTextEl = document.getElementById("statusText");
let saveDebounceTimer = null;

init();

function init() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
        const settings = { ...DEFAULT_SETTINGS, ...result };

        unifyRegionalVariantsEl.checked = Boolean(settings.unifyRegionalVariants);
        renderLanguageOptions(unifyRegionalVariantsEl.checked);

        ensureLanguageOption(settings.targetLanguage);
        targetLanguageEl.value = settings.targetLanguage;
        badgeSizeEl.value = String(settings.badgeSize);
        badgeSizeValueEl.value = `${settings.badgeSize}px`;
        badgeColorEl.value = settings.badgeColor;
        badgeColorAlphaEl.value = String(settings.badgeColorAlpha);
        badgeColorAlphaValueEl.value = `${settings.badgeColorAlpha}%`;
        badgeTextColorEl.value = settings.badgeTextColor;
        badgeTextColorAlphaEl.value = String(settings.badgeTextColorAlpha);
        badgeTextColorAlphaValueEl.value = `${settings.badgeTextColorAlpha}%`;

        const normalizedLanguage = normalizeLanguageForMode(targetLanguageEl.value, unifyRegionalVariantsEl.checked);
        if (normalizedLanguage !== targetLanguageEl.value) {
            targetLanguageEl.value = normalizedLanguage;
            scheduleSave(0);
        }
    });

    badgeSizeEl.addEventListener("input", () => {
        badgeSizeValueEl.value = `${badgeSizeEl.value}px`;
        scheduleSave(120);
    });

    targetLanguageEl.addEventListener("change", () => scheduleSave(0));
    badgeColorEl.addEventListener("input", () => scheduleSave(0));
    badgeColorAlphaEl.addEventListener("input", () => {
        badgeColorAlphaValueEl.value = `${badgeColorAlphaEl.value}%`;
        scheduleSave(0);
    });
    badgeTextColorEl.addEventListener("input", () => scheduleSave(0));
    badgeTextColorAlphaEl.addEventListener("input", () => {
        badgeTextColorAlphaValueEl.value = `${badgeTextColorAlphaEl.value}%`;
        scheduleSave(0);
    });
    unifyRegionalVariantsEl.addEventListener("change", () => {
        const unify = unifyRegionalVariantsEl.checked;
        const current = targetLanguageEl.value;
        renderLanguageOptions(unify);
        const normalizedLanguage = normalizeLanguageForMode(current, unify);
        ensureLanguageOption(normalizedLanguage);
        targetLanguageEl.value = normalizedLanguage;
        scheduleSave(0);
    });
}

function save() {
    const payload = {
        targetLanguage: normalizeLanguageForMode(
            (targetLanguageEl.value || DEFAULT_SETTINGS.targetLanguage).trim(),
            unifyRegionalVariantsEl.checked,
        ),
        badgeSize: clamp(Number(badgeSizeEl.value), 10, 24),
        badgeColor: badgeColorEl.value,
        badgeColorAlpha: clamp(Number(badgeColorAlphaEl.value), 0, 100),
        badgeTextColor: badgeTextColorEl.value,
        badgeTextColorAlpha: clamp(Number(badgeTextColorAlphaEl.value), 0, 100),
        badgeRadius: 2,
        unifyRegionalVariants: unifyRegionalVariantsEl.checked,
    };

    chrome.storage.sync.set(payload, () => {
        statusTextEl.textContent = "자동 저장됨";
        setTimeout(() => {
            statusTextEl.textContent = "";
        }, 1000);
    });
}

function scheduleSave(delayMs) {
    if (saveDebounceTimer) {
        clearTimeout(saveDebounceTimer);
    }

    saveDebounceTimer = setTimeout(() => {
        save();
    }, delayMs);
}

function renderLanguageOptions(unifyRegionalVariants) {
    const visibleOptions = LANGUAGE_OPTIONS.filter((item) => !(unifyRegionalVariants && item.regional));

    const optionsHtml = visibleOptions.map(
        (item) => `<option value="${item.value}">${item.label}</option>`,
    ).join("");
    targetLanguageEl.innerHTML = optionsHtml;
}

function ensureLanguageOption(value) {
    if (!value) {
        return;
    }

    const hasOption = Array.from(targetLanguageEl.options).some((option) => option.value === value);
    if (hasOption) {
        return;
    }

    const customOption = document.createElement("option");
    customOption.value = value;
    customOption.textContent = `사용자 지정 (${value})`;
    targetLanguageEl.appendChild(customOption);
}

function normalizeLanguageForMode(language, unifyRegionalVariants) {
    if (!unifyRegionalVariants || !language.includes("-")) {
        return language;
    }
    return language.split("-")[0];
}

function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.min(max, Math.max(min, value));
}
