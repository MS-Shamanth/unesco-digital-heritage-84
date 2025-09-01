import { ContentFetcherService } from '@/services/contentFetcher';
import { GeminiAnalysisService, AnalysisResult } from '@/services/geminiAnalysis';
import { CacheService } from '@/services/cacheService';

export interface MediaAnalysisResponse {
  id: string;
  title: string;
  content: string;
  url?: string;
  domain?: string;
  biasScore: number;
  confidence: number;
  sourceUrl?: string;
  mediaType: string;
  analysis: AnalysisResult;
  timestamp: Date;
  simpleRewrite?: string;
  otherSources?: string[];
  biasCheck?: string;
  credibilityScore?: string;
}

export const mediaApi = {
  analyze: async (data: {
    title: string;
    content: string;
    mediaType: string;
    userId: string;
    sourceUrl?: string;
  }): Promise<MediaAnalysisResponse> => {
    try {
      let title = data.title;
      let content = data.content;
      let url = data.sourceUrl;
      let domain: string | undefined;

      let extractedContent: any = null;
      
      // If sourceUrl is provided, extract content from URL
      if (data.sourceUrl) {
        try {
          extractedContent = await ContentFetcherService.extractFromUrl(data.sourceUrl);
          title = extractedContent.title;
          content = extractedContent.content;
          url = extractedContent.url;
          domain = extractedContent.domain;
        } catch (error) {
          console.warn('Content extraction failed, using provided content:', error);
          // Continue with provided content if URL extraction fails
        }
      }

      // Check cache first
      const cached = CacheService.getAnalysis(content);
      if (cached) {
        return {
          id: cached.id,
          title: cached.title,
          content: cached.content,
          url: cached.url,
          domain: cached.domain,
          biasScore: cached.analysis.overallScore,
          confidence: cached.analysis.credibility,
          sourceUrl: url,
          mediaType: data.mediaType,
          analysis: cached.analysis,
          timestamp: new Date(cached.timestamp),
          simpleRewrite: (cached as any).simpleRewrite,
          otherSources: (cached as any).otherSources,
          biasCheck: (cached as any).biasCheck,
          credibilityScore: (cached as any).credibilityScore,
        };
      }

      // Perform new analysis
      const analysisResult = await GeminiAnalysisService.analyzeContent(title, content, url);
      
      // Save to cache
      CacheService.saveAnalysis(title, content, analysisResult, url, domain, extractedContent?.simpleRewrite, extractedContent?.otherSources, extractedContent?.biasCheck, extractedContent?.credibilityScore);
      
      console.log('API - extracted content fields:', {
        simpleRewrite: extractedContent?.simpleRewrite,
        otherSources: extractedContent?.otherSources,
        biasCheck: extractedContent?.biasCheck,
        credibilityScore: extractedContent?.credibilityScore
      });
      
      // Clear expired cache entries
      CacheService.clearExpiredCache();

      const response: MediaAnalysisResponse = {
        id: CacheService.generateContentId(content),
        title,
        content,
        url,
        domain,
        biasScore: analysisResult.overallScore,
        confidence: analysisResult.credibility,
        sourceUrl: url,
        mediaType: data.mediaType,
        analysis: analysisResult,
        timestamp: new Date(),
        simpleRewrite: extractedContent?.simpleRewrite,
        otherSources: extractedContent?.otherSources,
        biasCheck: extractedContent?.biasCheck,
        credibilityScore: extractedContent?.credibilityScore,
      };

      return response;
    } catch (error) {
      console.error('Analysis failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Analysis failed');
    }
  },

  getCallsRemaining: () => {
    return GeminiAnalysisService.getCallsRemaining();
  },

  getCacheStats: () => {
    return CacheService.getCacheStats();
  }
};