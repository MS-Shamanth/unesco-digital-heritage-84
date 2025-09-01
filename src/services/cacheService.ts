
export interface CachedAnalysis {
  id: string;
  title: string;
  content: string;
  url?: string;
  domain?: string;
  analysis: any;
  timestamp: string;
  simpleRewrite?: string;
  otherSources?: string[];
  biasCheck?: string;
  credibilityScore?: string;
}

export class CacheService {
  private static readonly CACHE_KEY = 'media_literacy_cache';
  private static readonly STATS_KEY = 'cache_stats';
  private static readonly MAX_CACHE_SIZE = 50;
  private static readonly CACHE_EXPIRY_HOURS = 24;

  static saveAnalysis(
    title: string, 
    content: string, 
    analysis: any, 
    url?: string, 
    domain?: string,
    simpleRewrite?: string,
    otherSources?: string[],
    biasCheck?: string,
    credibilityScore?: string
  ): void {
    console.log('CacheService.saveAnalysis received:', { simpleRewrite, otherSources, biasCheck, credibilityScore });
    
    const cached: CachedAnalysis = {
      id: this.generateContentId(content),
      title,
      content,
      url,
      domain,
      analysis,
      timestamp: new Date().toISOString(),
      simpleRewrite,
      otherSources,
      biasCheck,
      credibilityScore,
    };
    
    console.log('CacheService.saveAnalysis storing:', cached);

    let cache = this.getCache();
    
    // Remove existing entry with same content
    cache = cache.filter(item => item.id !== cached.id);
    
    // Add new entry at the beginning
    cache.unshift(cached);
    
    // Limit cache size
    if (cache.length > this.MAX_CACHE_SIZE) {
      cache = cache.slice(0, this.MAX_CACHE_SIZE);
    }
    
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    this.updateStats();
  }

  static getAnalysis(content: string): CachedAnalysis | null {
    const id = this.generateContentId(content);
    const cache = this.getCache();
    
    const cached = cache.find(item => item.id === id);
    
    if (cached && this.isNotExpired(cached.timestamp)) {
      return cached;
    }
    
    return null;
  }

  static getAllAnalyses(): CachedAnalysis[] {
    return this.getCache().filter(item => this.isNotExpired(item.timestamp));
  }

  static getCache(): CachedAnalysis[] {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to parse cache:', error);
      return [];
    }
  }

  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    localStorage.removeItem(this.STATS_KEY);
  }

  static clearExpiredCache(): void {
    const cache = this.getCache();
    const validCache = cache.filter(item => this.isNotExpired(item.timestamp));
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(validCache));
    this.updateStats();
  }

  static getCacheStats() {
    const cache = this.getCache();
    const validCache = cache.filter(item => this.isNotExpired(item.timestamp));
    
    return {
      total: validCache.length,
      size: this.calculateCacheSize(),
      oldestEntry: validCache.length > 0 ? validCache[validCache.length - 1].timestamp : null,
      newestEntry: validCache.length > 0 ? validCache[0].timestamp : null,
    };
  }

  static generateContentId(content: string): string {
    // Simple hash function for content ID
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private static isNotExpired(timestamp: string): boolean {
    const cacheTime = new Date(timestamp);
    const expiryTime = new Date(cacheTime.getTime() + (this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000));
    return new Date() < expiryTime;
  }

  private static calculateCacheSize(): string {
    const cache = localStorage.getItem(this.CACHE_KEY);
    const sizeInBytes = cache ? new Blob([cache]).size : 0;
    const sizeInKB = sizeInBytes / 1024;
    return `${sizeInKB.toFixed(2)} KB`;
  }

  private static updateStats(): void {
    const stats = this.getCacheStats();
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }
}
