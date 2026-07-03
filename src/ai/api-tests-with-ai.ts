import { test as base, expect } from '@playwright/test';
import { explainFailure } from './failure-explainer';
import { getApiFailureContext, clearApiFailureContext } from './failure-context-store';

export const test = base.extend({});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const errorMessage = testInfo.errors.map((e) => e.message).join('\n') || 'Unknown error';
    const { apiRequest, apiResponse } = getApiFailureContext();

    const explanation = await explainFailure({
      testTitle: testInfo.title,
      errorMessage,
      apiRequest,
      apiResponse,
    });

    await testInfo.attach('AI Failure Explanation', {
      body: explanation,
      contentType: 'text/plain',
    });

    console.log(`\n🤖 AI Failure Explanation — "${testInfo.title}":\n${explanation}\n`);
  }
  clearApiFailureContext();
});

export { expect };