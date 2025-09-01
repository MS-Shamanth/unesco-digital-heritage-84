interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  channelTitle: string;
  publishedAt: string;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        medium?: { url: string };
        high?: { url: string };
      };
    };
  }>;
}

export class YouTubeService {
  private static API_KEY_STORAGE_KEY = 'youtube_api_key';
  private static DEFAULT_API_KEY = 'AIzaSyCW0FbTtDLztD6o3RQ_EXD-qyRpfOz4L7M';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    // Try to get from localStorage first, fallback to default
    return localStorage.getItem(this.API_KEY_STORAGE_KEY) || this.DEFAULT_API_KEY;
  }

  static initializeApiKey(): void {
    // Auto-save the default API key if none exists
    if (!localStorage.getItem(this.API_KEY_STORAGE_KEY)) {
      this.saveApiKey(this.DEFAULT_API_KEY);
    }
  }

  static generateSearchQuery(title: string, content: string): string {
    // Extract key topics from the news title and content
    const combinedText = `${title} ${content}`.toLowerCase();
    
    // Remove common words and focus on important terms
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    const words = combinedText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5); // Take top 5 relevant words
    
    // Add news-specific terms to get better results
    const searchTerms = [...words, 'news', 'explained', 'analysis'].join(' ');
    
    return searchTerms.trim();
  }

  static async searchVideos(query: string, maxResults: number = 3): Promise<YouTubeVideo[]> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      // Return mock videos if no API key is provided
      return this.getMockVideos(query);
    }

    try {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(query)}&` +
        `type=video&` +
        `maxResults=${maxResults}&` +
        `order=relevance&` +
        `safeSearch=strict&` +
        `regionCode=US&` +
        `relevanceLanguage=en&` +
        `key=${apiKey}`;

      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data: YouTubeSearchResponse = await response.json();
      
      return data.items.map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.high?.url || '',
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));
    } catch (error) {
      console.error('YouTube search failed:', error);
      // Fallback to mock videos
      return this.getMockVideos(query);
    }
  }

  private static getMockVideos(query: string): YouTubeVideo[] {
    // Generate contextual mock videos based on query
    const mockVideos: YouTubeVideo[] = [];
    
    if (query.toLowerCase().includes('technology') || query.toLowerCase().includes('ai')) {
      mockVideos.push({
        videoId: 'dQw4w9WgXcQ',
        title: `Technology News Explained: ${query.split(' ').slice(0, 3).join(' ')}`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        channelTitle: 'Tech News Network',
        publishedAt: new Date().toISOString()
      });
    } else if (query.toLowerCase().includes('politics') || query.toLowerCase().includes('government')) {
      mockVideos.push({
        videoId: 'dQw4w9WgXcQ',
        title: `Political Analysis: ${query.split(' ').slice(0, 3).join(' ')}`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        channelTitle: 'News Analysis Channel',
        publishedAt: new Date().toISOString()
      });
    } else {
      mockVideos.push({
        videoId: 'dQw4w9WgXcQ',
        title: `Breaking News Analysis: ${query.split(' ').slice(0, 3).join(' ')}`,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        channelTitle: 'Global News Network',
        publishedAt: new Date().toISOString()
      });
    }
    
    return mockVideos;
  }

  static async searchNewsVideos(title: string, content: string): Promise<YouTubeVideo[]> {
    const searchQuery = this.generateSearchQuery(title, content);
    return this.searchVideos(searchQuery, 3);
  }
}