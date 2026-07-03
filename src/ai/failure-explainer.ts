// Option A (Failure Explainer) was chosen over Option B (Flaky Test Classifier)
// because it produces a real, convincing artifact from a single deliberate
// failure (see LOGIN-010), whereas a flaky-test classifier needs genuine
// intermittent failures across multiple runs to be meaningfully tested —
// harder to demonstrate honestly without fabricating flaky behavior.

import { LlmClient } from './llm-client';
import { buildExplainerPrompt, FailureContext } from './explainer-prompt';

export async function explainFailure(ctx: FailureContext): Promise<string> {
  const client = new LlmClient();
  const prompt = buildExplainerPrompt(ctx);
  try {
    return await client.complete(prompt);
  } catch (err) {
    return `[Failure Explainer error: could not reach LLM API — ${(err as Error).message}]`;
  }
}