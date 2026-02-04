let currentLang = localStorage.getItem("lang") || "en";
let translations = {};

export async function loadLanguage(lang) {
    currentLang = lang || currentLang;
    localStorage.setItem("lang", currentLang);

    const res = await fetch(`/static/i18n/${currentLang}.json`);
    if (!res.ok) throw new Error("i18n file not found");

    translations = await res.json();
    translatePage();
    document.dispatchEvent(new Event("languageChanged"));
}

export function t(key) {
    return key.split(".").reduce((obj, k) => obj?.[k], translations) || key;
}

export function translatePage(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
}

export async function initI18n() {
    await loadLanguage(currentLang);
}