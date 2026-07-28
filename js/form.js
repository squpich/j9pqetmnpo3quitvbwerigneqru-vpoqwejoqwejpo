(() => {
  const form = document.querySelector("[data-request-form]");
  const status = document.querySelector("[data-form-status]");
  if (!form) return;

  const getText = key => window.GEA_I18N?.get(key) || key;

  function clearErrors() {
    form.querySelectorAll(".error-message").forEach(element => {
      element.textContent = "";
    });

    form.querySelectorAll('[aria-invalid="true"]').forEach(element => {
      element.removeAttribute("aria-invalid");
    });

    const consentError = form.querySelector("[data-consent-error]");
    if (consentError) consentError.textContent = "";

    if (status) {
      status.textContent = "";
      status.className = "form-status";
    }
  }

  function setFieldError(field, messageKey) {
    field.setAttribute("aria-invalid", "true");
    const error = form.querySelector(`[data-error-for="${field.name}"]`);
    if (error) error.textContent = getText(messageKey);
  }

  function validate() {
    clearErrors();
    let valid = true;

    const requiredNames = ["name", "email", "phone", "location"];
    requiredNames.forEach(name => {
      const field = form.elements[name];
      if (!field.value.trim()) {
        valid = false;
        setFieldError(field, "form.errors.required");
      }
    });

    const email = form.elements.email;
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      valid = false;
      setFieldError(email, "form.errors.email");
    }

    const phone = form.elements.phone;
    if (phone.value && !/^[+\d\s().-]{7,}$/.test(phone.value)) {
      valid = false;
      setFieldError(phone, "form.errors.phone");
    }

    const consent = form.elements.consent;
    if (!consent.checked) {
      valid = false;
      const consentError = form.querySelector("[data-consent-error]");
      if (consentError) consentError.textContent = getText("form.errors.consent");
    }

    return valid;
  }

  function setSubmitting(submitting) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;

    button.disabled = submitting;
    button.classList.toggle("is-loading", submitting);
    button.setAttribute("aria-busy", String(submitting));
  }

  function setStatus(type, text) {
    if (!status) return;
    status.className = `form-status form-status-${type}`;
    status.textContent = text;
  }

  async function sendForm() {
    const config = window.GEA_CONFIG?.form || {};
    const payload = Object.fromEntries(new FormData(form).entries());

    if (config.mode === "demo" || !config.endpoint) {
      await new Promise(resolve => setTimeout(resolve, 650));
      return { ok: true, demo: true };
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(
      () => controller.abort(),
      config.timeoutMs || 12000
    );

    try {
      const response = await fetch(config.endpoint, {
        method: config.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
      return { ok: true };
    } finally {
      clearTimeout(timeout);
    }
  }

  form.addEventListener("input", event => {
    if (event.target.matches("[aria-invalid='true']")) {
      event.target.removeAttribute("aria-invalid");
      const error = form.querySelector(`[data-error-for="${event.target.name}"]`);
      if (error) error.textContent = "";
    }
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (form.elements.company_website?.value) return;
    if (!validate()) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    setSubmitting(true);

    try {
      await sendForm();
      form.reset();
      setStatus("success", getText("form.success"));

      window.dispatchEvent(new CustomEvent("gea:form-success", {
        detail: { location: form.elements.location?.value || "" }
      }));
    } catch (error) {
      console.error(error);
      setStatus("error", getText("form.errors.submit"));
    } finally {
      setSubmitting(false);
    }
  });
})();
