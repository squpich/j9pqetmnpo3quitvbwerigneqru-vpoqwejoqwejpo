(() => {
  const supported = ["en", "uk", "pt-PT"];
  const fallback = "en";
  const cache = new Map();
  let translations = {};
  let currentLanguage = fallback;

  function nestedGet(object, path) {
    return path.split(".").reduce((value, key) => value?.[key], object);
  }

  async function fetchTranslations(language) {
    if (cache.has(language)) return cache.get(language);

    const response = await fetch(`lang/${language}.json`, {
      cache: "no-cache",
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Unable to load language file: ${language}`);
    }

    const data = await response.json();
    cache.set(language, data);
    return data;
  }

  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const value = nestedGet(translations, element.dataset.i18n);
      if (typeof value === "string") element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
      const value = nestedGet(translations, element.dataset.i18nPlaceholder);
      if (typeof value === "string") element.placeholder = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(element => {
      const value = nestedGet(translations, element.dataset.i18nAria);
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-content]").forEach(element => {
      const value = nestedGet(translations, element.dataset.i18nContent);
      if (typeof value === "string") element.setAttribute("content", value);
    });

    const title = nestedGet(translations, "meta.title");
    if (typeof title === "string") document.title = title;
  }

  function updateSwitcher() {
    document.querySelectorAll("[data-lang]").forEach(button => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  async function setLanguage(language) {
    const target = supported.includes(language) ? language : fallback;

    try {
      translations = await fetchTranslations(target);
      currentLanguage = target;
    } catch (error) {
      console.error(error);
      if (target !== fallback) {
        translations = await fetchTranslations(fallback);
        currentLanguage = fallback;
      }
    }

    localStorage.setItem("gea-language", currentLanguage);
    document.documentElement.lang = currentLanguage;
    applyTranslations();
    updateSwitcher();

    window.dispatchEvent(new CustomEvent("languagechange", {
      detail: { language: currentLanguage }
    }));
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-lang]");
    if (button) setLanguage(button.dataset.lang);
  });

  const saved = localStorage.getItem("gea-language");
  const browser = navigator.language?.toLowerCase().startsWith("pt")
    ? "pt-PT"
    : navigator.language?.toLowerCase().startsWith("uk")
      ? "uk"
      : fallback;

  window.GEA_I18N = {
    get: key => nestedGet(translations, key),
    setLanguage,
    getLanguage: () => currentLanguage
  };

  setLanguage(saved || browser);
})();
