##Stack
- Playwright+Typescript
- LLM Gemini 2.5 flash

##Setup
- npm install
- npx playwright install

##Structure
reports/                    - Playwright's generated HTML output
src/
    -> ai/                         - LLM integration
        -> api-tests-with-ai.ts          - wraps API specs so failed API tests auto-trigger an LLM explanation
        -> explainer-prompt.ts           - Builds the prompt sent to the LLM from failure context
        -> failure context-store.ts      - Lightweight in-memory store letting API tests pass request/response details to the failure hook
        -> failure-explainer.ts          - calls the LLM client with a built prompt and returns the explanation
        -> llm-client.ts                 - Thin wrapper around the Gemini API
        -> test-with-ai.ts               - auto-attaches an AI failure explanation to the report on any failed test
    -> pages/                      - Page Object Models + API client
        -> api.ts                        - API client wrapping calls to the Notes REST API
        -> dashboard.ts                  - Page Object Model for the notes dashboard
        -> login.ts                      - Page Object Model for login/registration flows
test-generation/            - AI-generated test cases and notes
    -> generated/
        -> api.json                      - Generated REST API test cases
        -> dashboard.feature             - Generated Gherkin test cases for the Dashboard module
        -> login.feature                 - Generated Gherkin test cases for the Login module
    -> notes.md                    - Per-module notes
    -> prompts.md                  - raw LLM prompt used to generate the test cases, verbatim etc.
tests/                      - Automated Playwright specs, implementing a subset of the generated cases against the live site
    -> api.spec.ts                 - Test cases implented in the API module
    -> dashboard.spec.ts           - Test cases implented in the dashboard module
    -> login.spec.ts               - Test cases implented in the login module
.env.example                - Template listing required environment variables
.gitignore                  - Exclude file/folders
ai-usage-log.md             - Log of AI tools used across the project
package-lock.json           - Locked dependency versions for reproducible installs.
package.json                - Project metadata, scripts, and dependencies
playwright.config.ts        - Playwright test runner configuration
README.md                   - Setup and run instructions and project overview
tsconfig.json               - TypeScript compiler configuration

##To check the existing result from LLM for failure explainer
- npx playwright show-report reports/html-report
(Check the failed test and under attachments)

##Running tests
- npx playwright test

##Given more time, I'd add the other feature as well, that is, Flaky test classifier and also an AI powered auto-healing mechanism
