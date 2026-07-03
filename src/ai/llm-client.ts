const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models';

export interface LlmClientOptions {
  apiKey?: string;
  model?: string;
}

export class LlmClient {
  private apiKey: string;
  private model: string;

  constructor(options: LlmClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.LLM_API_KEY || '';
    this.model =
      options.model || process.env.LLM_MODEL || 'gemini-2.5-flash';

    if (!this.apiKey) {
      throw new Error('LLM_API_KEY is not set. Add it to your .env file.');
    }
  }

  async complete(prompt: string, maxTokens = 400): Promise<string> {
    const response = await fetch(
      `${GEMINI_API_URL}/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            maxOutputTokens: maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`LLM API request failed (${response.status}): ${errText}`);
    }

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      '[No text response from LLM]'
    );
  }
}