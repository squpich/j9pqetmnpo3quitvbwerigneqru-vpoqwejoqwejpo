window.addEventListener("gea:analytics", event => {
  const { event: eventName, label } = event.detail;

  // Google Analytics example:
  // window.gtag?.("event", eventName, { event_label: label });

  console.log("[Analytics hook]", eventName, label);
});

window.addEventListener("gea:form-success", event => {
  // window.gtag?.("event", "generate_lead");
  console.log("[Lead generated]", event.detail);
});
