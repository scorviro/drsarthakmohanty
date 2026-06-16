export function logError(context: string, error: unknown) {
  const isProd = process.env.NODE_ENV === "production";
  if (error instanceof Error) {
    if (isProd) {
      // In production, log only the message to prevent leaking full stack traces, local paths, or database internals
      console.error(`[ERROR] ${context}: ${error.message}`);
    } else {
      console.error(`[ERROR] ${context}:`, error);
    }
  } else {
    console.error(`[ERROR] ${context}:`, String(error));
  }
}
