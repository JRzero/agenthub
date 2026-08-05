const sensitivePatterns = [
  /(?:api[_-]?key|token|authorization|cookie|jwt)\s*[:=]\s*\S+/gi,
  /(?:\/Users|\/home|[A-Za-z]:\\)[^\s"']+/g,
  /https?:\/\/[^\s"']+/g,
];

export function getSafeResourceError(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  const message = sensitivePatterns.reduce((value, pattern) => value.replace(pattern, ""), error.message).trim();
  if (!message || message.length > 160 || /(?:stack|traceback|internal server|sql|exception)/i.test(message)) return fallback;
  return message;
}
