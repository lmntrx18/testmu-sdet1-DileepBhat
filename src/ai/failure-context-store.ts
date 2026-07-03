interface StoredApiContext {
  apiRequest?: { method: string; endpoint: string; body?: unknown };
  apiResponse?: { status: number; body: unknown };
}

let current: StoredApiContext = {};

export function setApiFailureContext(ctx: StoredApiContext) {
  current = ctx;
}

export function clearApiFailureContext() {
  current = {};
}

export function getApiFailureContext(): StoredApiContext {
  return current;
}