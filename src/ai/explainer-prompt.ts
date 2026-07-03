export interface FailureContext {
  testTitle: string;
  errorMessage: string;
  url?: string;
  domSnippet?: string;
  apiRequest?: { method: string; endpoint: string; body?: unknown };
  apiResponse?: { status: number; body: unknown };
}

export function buildExplainerPrompt(ctx: FailureContext): string {
  return `You are a senior SDET helping debug a failed automated test.

Test: "${ctx.testTitle}"

Error message thrown by the test runner:
${ctx.errorMessage}

${ctx.url ? `Page URL at time of failure: ${ctx.url}` : ''}
${ctx.domSnippet ? `Relevant DOM snippet (truncated):\n${ctx.domSnippet}` : ''}
${ctx.apiRequest ? `API request made: ${ctx.apiRequest.method} ${ctx.apiRequest.endpoint}${ctx.apiRequest.body ? ` body=${JSON.stringify(ctx.apiRequest.body)}` : ''}` : ''}
${ctx.apiResponse ? `API response received: status=${ctx.apiResponse.status} body=${JSON.stringify(ctx.apiResponse.body)}` : ''}

Respond in exactly this format:
ROOT CAUSE: <one or two sentences explaining what actually broke, in plain English>
SUGGESTED FIX: <a specific, actionable fix — selector change, wait condition, environment issue, or note if this looks like a genuine application bug rather than a test bug>
CONFIDENCE: <High | Medium | Low>

Be concise. Do not restate the error message verbatim back to me.`;
}