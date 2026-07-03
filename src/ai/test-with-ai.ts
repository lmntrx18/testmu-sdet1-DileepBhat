import { test as base, expect } from '@playwright/test';
import { explainFailure } from './failure-explainer';

export const test = base.extend({});

test.afterEach(async ({ page }, testInfo) => {
    console.log("AI afterEach executed");
    console.log("Status:", testInfo.status);
    console.log("Expected:", testInfo.expectedStatus);
  if (testInfo.status !== testInfo.expectedStatus) {
    console.log("Test failed - calling Gemini");
    const errorMessage = testInfo.errors.map((e) => e.message).join('\n') || 'Unknown error';
    let domSnippet = '';
    let url = '';

    try {
      url = page.url();
      const html = await page.evaluate(() => document.body.outerHTML);
      domSnippet = html.slice(0, 2000); // truncate to keep the prompt small
    } catch {
      // page may already be closed/navigated away — safe to skip
    }

    const explanation = await explainFailure({
      testTitle: testInfo.title,
      errorMessage,
      url,
      domSnippet,
    });

    await testInfo.attach('AI Failure Explanation', {
      body: explanation,
      contentType: 'text/plain',
    });

    console.log(`\n🤖 AI Failure Explanation — "${testInfo.title}":\n${explanation}\n`);
  }
});

export { expect };