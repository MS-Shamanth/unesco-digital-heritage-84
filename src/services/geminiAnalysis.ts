// Gemini AI service for media bias and credibility analysis
export interface AnalysisResult {
  overallScore: number;      // 0-100
  factuality: number;        // 0-100  
  credibility: number;       // 0-100
  biasLevel: string;         // "Low Bias"|"Moderate Bias"|"High Bias"
  biasRationale: string;     // Brief explanation
  claims: string[];          // Verifiable claims
  sentiment: string;         // "Positive"|"Negative"|"Neutral"
  credibilityRationale: string; // Brief explanation
  safetyFlags: string[];     // Issues found
}

export class GeminiAnalysisService {
  private static readonly API_KEY = "AIzaSyAbbTv_b8mY1E2HK5w8vWWZ_WSME5DnaJQ";
  private static readonly API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  private static readonly MAX_CALLS_PER_SESSION = 5;
  private static callCount = 0;
  
  static getCallsRemaining(): number {
    return Math.max(0, this.MAX_CALLS_PER_SESSION - this.callCount);
  }
  
  static async analyzeContent(title: string, content: string, url?: string): Promise<AnalysisResult> {
    if (this.callCount >= this.MAX_CALLS_PER_SESSION) {
      throw new Error("API rate limit exceeded. Maximum 5 analyses per session.");
    }
    
    try {
      const prompt = this.createAnalysisPrompt(title, content, url);
      
      const response = await fetch(`${this.API_ENDPOINT}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }
      
      const data = await response.json();
      this.callCount++;
      
      // Extract text from Gemini response
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!analysisText) {
        throw new Error("Invalid response from Gemini API");
      }
      
      return this.parseAnalysisResult(analysisText);
    } catch (error) {
      console.error('Gemini analysis failed:', error);
      // Return heuristic fallback analysis
      return this.getHeuristicAnalysis(title, content);
    }
  }
  
  private static createAnalysisPrompt(title: string, content: string, url?: string): string {
    return `Analyze the following article for bias, credibility, and factuality. Respond ONLY with a valid JSON object in this exact format:

{
  "overallScore": <number 0-100>,
  "factuality": <number 0-100>,
  "credibility": <number 0-100>,
  "biasLevel": "<Low Bias|Moderate Bias|High Bias>",
  "biasRationale": "<brief explanation>",
  "claims": ["<claim1>", "<claim2>", "<claim3>"],
  "sentiment": "<Positive|Negative|Neutral>",
  "credibilityRationale": "<brief explanation>",
  "safetyFlags": ["<flag1>", "<flag2>"]
}

Article Title: ${title}
${url ? `Source URL: ${url}` : ''}
Content: ${content.slice(0, 3000)}...

Focus on:
- Factual accuracy and verifiable claims
- Source credibility and author expertise
- Political/ideological bias indicators
- Emotional language vs. neutral reporting
- Evidence quality and citation practices`;
  }
  
  private static parseAnalysisResult(analysisText: string): AnalysisResult {
    try {
      // Clean the response to extract JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      return {
        overallScore: Math.min(100, Math.max(0, parsed.overallScore || 50)),
        factuality: Math.min(100, Math.max(0, parsed.factuality || 50)),
        credibility: Math.min(100, Math.max(0, parsed.credibility || 50)),
        biasLevel: ["Low Bias", "Moderate Bias", "High Bias"].includes(parsed.biasLevel) 
          ? parsed.biasLevel : "Moderate Bias",
        biasRationale: parsed.biasRationale || "Analysis not available",
        claims: Array.isArray(parsed.claims) ? parsed.claims.slice(0, 3) : [],
        sentiment: ["Positive", "Negative", "Neutral"].includes(parsed.sentiment) 
          ? parsed.sentiment : "Neutral",
        credibilityRationale: parsed.credibilityRationale || "Analysis not available",
        safetyFlags: Array.isArray(parsed.safetyFlags) ? parsed.safetyFlags : []
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      throw new Error("Failed to parse analysis results");
    }
  }
  
  private static getHeuristicAnalysis(title: string, content: string): AnalysisResult {
    // Simple heuristic analysis as fallback
    const text = (title + " " + content).toLowerCase();
    
    // Basic bias indicators
    const biasWords = ['always', 'never', 'terrible', 'amazing', 'disaster', 'perfect'];
    const biasCount = biasWords.filter(word => text.includes(word)).length;
    
    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success'];
    const negativeWords = ['bad', 'terrible', 'awful', 'negative', 'failure'];
    const positiveCount = positiveWords.filter(word => text.includes(word)).length;
    const negativeCount = negativeWords.filter(word => text.includes(word)).length;
    
    const biasScore = Math.min(100, biasCount * 20);
    const sentiment = positiveCount > negativeCount ? 'Positive' : 
                     negativeCount > positiveCount ? 'Negative' : 'Neutral';
    
    return {
      overallScore: 75 - biasScore,
      factuality: 70,
      credibility: 65,
      biasLevel: biasScore > 60 ? "High Bias" : biasScore > 30 ? "Moderate Bias" : "Low Bias",
      biasRationale: "Heuristic analysis - API unavailable",
      claims: ["Analysis limited without AI service"],
      sentiment,
      credibilityRationale: "Basic analysis - full assessment unavailable",
      safetyFlags: biasScore > 60 ? ["High bias detected"] : []
    };
  }
}