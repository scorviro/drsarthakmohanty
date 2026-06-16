const required = ["SESSION_SECRET", "PORTAL_EMAIL", "PORTAL_PASSWORD"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`[CRITICAL] Missing required environment variable: ${key}`);
  }
});
