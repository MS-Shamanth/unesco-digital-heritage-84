// Utility to clear all cached data and reset the application
export class CacheClearService {
  static clearAllCache(): void {
    try {
      // Clear media literacy cache
      localStorage.removeItem('media_literacy_cache');
      
      // Clear saved items
      localStorage.removeItem('savedItems');
      
      // Clear any other related storage
      localStorage.removeItem('media_analysis_cache');
      
      // Clear session storage as well
      sessionStorage.clear();
      
      console.log('All cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
  
  static clearSpecificCache(cacheKey: string): void {
    try {
      localStorage.removeItem(cacheKey);
      console.log(`Cache cleared for key: ${cacheKey}`);
    } catch (error) {
      console.error(`Error clearing cache for key ${cacheKey}:`, error);
    }
  }
}