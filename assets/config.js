// Public configuration only. Never add API keys or CRM secrets to static assets.
window.DHRUV_CONFIG = Object.freeze({
  // Add the approved HTTPS CRM form URL when it is supplied. Until then,
  // the on-page form is explicitly a preview and transmits no information.
  registrationUrl: '',
});
