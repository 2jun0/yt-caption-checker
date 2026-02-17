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

const POPUP_I18N = {
    ko: {
        title: "자막 태그 설정",
        subtitle: "변경 사항이 자동으로 저장되고 즉시 적용됩니다.",
        uiLanguageLabel: "UI 언어",
        captionLanguageLabel: "자막 언어",
        badgeSizeLabel: "태그 크기",
        badgeBgColorLabel: "태그 배경색",
        badgeBgAlphaLabel: "배경 투명도",
        badgeTextColorLabel: "태그 글자색",
        badgeTextAlphaLabel: "글자 투명도",
        unifyRegionalVariantsLabel: "언어 통합 검색 (예: en-GB, en-US → en)",
        autosaved: "자동 저장됨",
        customLanguage: "사용자 지정",
    },
    en: {
        title: "Caption Badge Settings",
        subtitle: "Changes are saved automatically and applied immediately.",
        uiLanguageLabel: "UI language",
        captionLanguageLabel: "Caption language",
        badgeSizeLabel: "Badge size",
        badgeBgColorLabel: "Badge background color",
        badgeBgAlphaLabel: "Background opacity",
        badgeTextColorLabel: "Badge text color",
        badgeTextAlphaLabel: "Text opacity",
        unifyRegionalVariantsLabel: "Unify regional variants (e.g., en-GB, en-US → en)",
        autosaved: "Autosaved",
        customLanguage: "Custom",
    },
    ja: {
        title: "字幕バッジ設定",
        subtitle: "変更は自動保存され、すぐに反映されます。",
        uiLanguageLabel: "UI 言語",
        captionLanguageLabel: "字幕言語",
        badgeSizeLabel: "バッジサイズ",
        badgeBgColorLabel: "バッジ背景色",
        badgeBgAlphaLabel: "背景の透明度",
        badgeTextColorLabel: "バッジ文字色",
        badgeTextAlphaLabel: "文字の透明度",
        unifyRegionalVariantsLabel: "地域バリエーションを統合 (例: en-GB, en-US → en)",
        autosaved: "自動保存済み",
        customLanguage: "カスタム",
    },
    "zh-CN": {
        title: "字幕标签设置",
        subtitle: "更改会自动保存并立即生效。",
        uiLanguageLabel: "界面语言",
        captionLanguageLabel: "字幕语言",
        badgeSizeLabel: "标签大小",
        badgeBgColorLabel: "标签背景色",
        badgeBgAlphaLabel: "背景透明度",
        badgeTextColorLabel: "标签文字颜色",
        badgeTextAlphaLabel: "文字透明度",
        unifyRegionalVariantsLabel: "合并地区变体（例如 en-GB, en-US → en）",
        autosaved: "已自动保存",
        customLanguage: "自定义",
    },
    es: {
        title: "Configuración de etiqueta de subtítulos",
        subtitle: "Los cambios se guardan automáticamente y se aplican de inmediato.",
        uiLanguageLabel: "Idioma de la interfaz",
        captionLanguageLabel: "Idioma de subtítulos",
        badgeSizeLabel: "Tamaño de etiqueta",
        badgeBgColorLabel: "Color de fondo",
        badgeBgAlphaLabel: "Opacidad del fondo",
        badgeTextColorLabel: "Color del texto",
        badgeTextAlphaLabel: "Opacidad del texto",
        unifyRegionalVariantsLabel: "Unificar variantes regionales (ej.: en-GB, en-US → en)",
        autosaved: "Guardado automático",
        customLanguage: "Personalizado",
    },
    it: {
        title: "Impostazioni badge sottotitoli",
        subtitle: "Le modifiche vengono salvate automaticamente e applicate subito.",
        uiLanguageLabel: "Lingua interfaccia",
        captionLanguageLabel: "Lingua sottotitoli",
        badgeSizeLabel: "Dimensione badge",
        badgeBgColorLabel: "Colore sfondo badge",
        badgeBgAlphaLabel: "Opacità sfondo",
        badgeTextColorLabel: "Colore testo badge",
        badgeTextAlphaLabel: "Opacità testo",
        unifyRegionalVariantsLabel: "Unifica varianti regionali (es.: en-GB, en-US → en)",
        autosaved: "Salvataggio automatico",
        customLanguage: "Personalizzato",
    },
};

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
let activeUiLanguage = "en";

init();

function init() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, (result) => {
        const settings = { ...DEFAULT_SETTINGS, ...result };

        activeUiLanguage = resolveUiLanguage();
        applyPopupI18n(activeUiLanguage);

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
        statusTextEl.textContent = t("autosaved");
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
    const visibleOptions = CAPTION_LANGUAGE_OPTIONS.filter(
        (item) => !(unifyRegionalVariants && isRegionalCode(item.value)),
    );

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
    customOption.textContent = `${t("customLanguage")} (${value})`;
    targetLanguageEl.appendChild(customOption);
}

function normalizeLanguageForMode(language, unifyRegionalVariants) {
    if (!unifyRegionalVariants || !isRegionalCode(language)) {
        return language;
    }
    return language.split(/[-_]/)[0];
}

function isRegionalCode(code) {
    return /[-_]/.test(String(code || ""));
}

function resolveUiLanguage() {
    const browserLang = chrome.i18n.getUILanguage() || "en";
    return normalizeUiLanguage(browserLang);
}

function normalizeUiLanguage(lang) {
    const lc = String(lang || "en");
    if (lc.startsWith("ko")) {
        return "ko";
    }
    if (lc.startsWith("ja")) {
        return "ja";
    }
    if (lc.startsWith("zh")) {
        return "zh-CN";
    }
    if (lc.startsWith("es")) {
        return "es";
    }
    if (lc.startsWith("it")) {
        return "it";
    }
    return "en";
}

function applyPopupI18n(lang) {
    document.documentElement.lang = lang;
    document.getElementById("titleText").textContent = t("title", lang);
    document.getElementById("subtitleText").textContent = t("subtitle", lang);
    document.getElementById("captionLanguageLabel").textContent = t("captionLanguageLabel", lang);
    document.getElementById("badgeSizeLabel").textContent = t("badgeSizeLabel", lang);
    document.getElementById("badgeBgColorLabel").textContent = t("badgeBgColorLabel", lang);
    document.getElementById("badgeBgAlphaLabel").textContent = t("badgeBgAlphaLabel", lang);
    document.getElementById("badgeTextColorLabel").textContent = t("badgeTextColorLabel", lang);
    document.getElementById("badgeTextAlphaLabel").textContent = t("badgeTextAlphaLabel", lang);
    document.getElementById("unifyRegionalVariantsLabel").textContent = t("unifyRegionalVariantsLabel", lang);
}

function t(key, lang = activeUiLanguage) {
    return POPUP_I18N[lang]?.[key] || POPUP_I18N.en[key] || key;
}

function clamp(value, min, max) {
    if (!Number.isFinite(value)) {
        return min;
    }
    return Math.min(max, Math.max(min, value));
}
