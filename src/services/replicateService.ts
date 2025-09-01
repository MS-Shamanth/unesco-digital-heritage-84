import Replicate from "replicate";

export interface VideoGenerationParams {
  prompt: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  duration?: number;
}

export class ReplicateService {
  private replicate: Replicate | null = null;
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    // Try to get API key from environment or parameter
    const key = apiKey || import.meta.env.VITE_REPLICATE_API_KEY || this.getStoredApiKey();
    if (key) {
      this.apiKey = key;
      this.replicate = new Replicate({
        auth: key,
      });
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.replicate = new Replicate({
      auth: apiKey,
    });
    // Store in localStorage for persistence
    localStorage.setItem('replicate_api_key', apiKey);
  }

  getStoredApiKey(): string | null {
    return localStorage.getItem('replicate_api_key');
  }

  clearApiKey() {
    this.apiKey = null;
    this.replicate = null;
    localStorage.removeItem('replicate_api_key');
  }

  async generateVideo(params: VideoGenerationParams): Promise<string> {
    if (!this.replicate || !this.apiKey) {
      throw new Error('Replicate API key not configured');
    }

    try {
      const output = await this.replicate.run(
        "minimax/video-01",
        {
          input: {
            prompt: params.prompt,
            aspect_ratio: params.aspectRatio || "16:9",
            duration: params.duration || 6,
          }
        }
      );

      // Handle different response types from Replicate API
      if (typeof output === 'string') {
        return output;
      } else if (Array.isArray(output) && output.length > 0) {
        return output[0];
      } else if (output && typeof output === 'object' && 'url' in output) {
        return (output as any).url;
      }
      
      throw new Error('Unexpected response format from Replicate API');
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Video generation failed');
    }
  }

  generateAnalysisPrompt(title: string, content: string, analysis: any): string {
    const biasLevel = analysis.biasLevel || 'Unknown';
    const credibility = analysis.credibility || 'Unknown';
    const claims = analysis.claims || [];
    const sentiment = analysis.sentiment || 'Neutral';
    
    return `Create a professional news analysis video explaining: "${title}". 

Key points to cover:
- Main story: ${content.substring(0, 200)}...
- Credibility rating: ${credibility}% reliable
- Bias level: ${biasLevel}
- Sentiment: ${sentiment}
${claims.length > 0 ? `- Key claims: ${claims.slice(0, 3).join(', ')}` : ''}

Style: Professional news anchor presentation with clear explanations, visual graphics showing credibility scores and bias analysis. Make it informative and engaging for media literacy education.`;
  }

  isConfigured(): boolean {
    return this.replicate !== null && this.apiKey !== null;
  }
}

export const replicateService = new ReplicateService();