export interface AiPrompt {
  template: string;
  variables: Record<string, string>;
}

export interface AiResult {
  text: string;
  metadata: Record<string, unknown>;
}

export interface AiClient {
  generate: (prompt: AiPrompt) => Promise<AiResult>;
}

export class MockAiClient implements AiClient {
  async generate(prompt: AiPrompt): Promise<AiResult> {
    return {
      text: `Summary based on: ${prompt.variables.title}`,
      metadata: {
        promptTemplate: prompt.template,
        promptVersion: 'v1'
      }
    };
  }
}
