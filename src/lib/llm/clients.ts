import { LLMRequest, LLMResponse, LLMConfig } from './types';

// Simple OpenAI client implementation
export class LLMClient {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateContent(request: LLMRequest): Promise<LLMResponse> {
    const apiKey = this.config.apiKey;
    
    if (!apiKey) {
      throw new Error('LLM API key is not configured');
    }

    // Using OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: request.messages,
        temperature: request.temperature || this.config.temperature || 0.7,
        max_tokens: request.maxTokens || this.config.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

// Factory function to create LLM client
export function createLLMClient(): LLMClient {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  return new LLMClient({
    provider: 'openai',
    apiKey: apiKey,
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
  });
}
