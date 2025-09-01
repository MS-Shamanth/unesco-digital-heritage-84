// Content fetching service for extracting article content from URLs
export interface ExtractedContent {
  title: string;
  content: string;
  url: string;
  domain: string;
  publishDate?: string;
  author?: string;
  simpleRewrite?: string;
  otherSources?: string[];
  biasCheck?: string;
  credibilityScore?: string;
}

export class ContentFetcherService {
  private static readonly API_ENDPOINT = "https://8ef3d0b0af29.ngrok-free.app/extract";
  
  static async extractFromUrl(url: string): Promise<ExtractedContent> {
    // Validate URL format
    if (!this.isValidUrl(url)) {
      throw new Error("Invalid URL format");
    }
    
    try {
      const response = await fetch(`${this.API_ENDPOINT}?url=${encodeURIComponent(url)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle new API response format
      const extracted = data.extracted || {};
      const extractedNews = data.extracted_news || {};
      
      // Ensure we have required fields
      if (!extracted.title && !extractedNews.full_text) {
        throw new Error("Incomplete content extracted from URL");
      }
      
      console.log('Raw API response data:', { extracted, extractedNews, data });
      console.log('Mapping fields - simple_rewrite:', extractedNews.simple_rewrite, 'other_sources:', data.other_sources);
      
      return {
        title: extracted.title || `Content from ${this.extractDomain(url)}`,
        content: extractedNews.full_text || extracted.summary || "Content extraction failed",
        url: url,
        domain: this.extractDomain(url),
        publishDate: extracted.publish_date || extracted.publishDate,
        author: extracted.author,
        simpleRewrite: extractedNews.simple_rewrite,
        otherSources: data.other_sources || [],
        biasCheck: data.bias_check,
        credibilityScore: data.credibility_score,
      };
    } catch (error) {
      console.error('Content extraction failed:', error);
      
      // Fallback: create basic content structure from URL
      return this.createFallbackContent(url);
    }
  }
  
  private static isValidUrl(string: string): boolean {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }
  
  private static extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch (_) {
      return 'unknown-domain.com';
    }
  }
  
  private static createFallbackContent(url: string): ExtractedContent {
    return {
      title: `Content from ${this.extractDomain(url)}`,
      content: `Unable to extract full content from ${url}. Please paste the article text directly for analysis.`,
      url,
      domain: this.extractDomain(url),
    };
  }
}