import React, { useState, useEffect } from 'react';
import { Play, Key, Loader2, Download, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { replicateService } from '@/services/replicateService';
import { YouTubeService } from '@/services/youtubeService';
import { useIsMobile } from '@/hooks/use-mobile';

interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
  channelTitle: string;
  publishedAt: string;
}

interface VideoGeneratorProps {
  analysisTitle?: string;
  analysisContent?: string;
  analysisData?: any;
}

export const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  analysisTitle = "",
  analysisContent = "",
  analysisData
}) => {
  const [apiKey, setApiKey] = useState('');
  const [showYouTubeApiKeyInput, setShowYouTubeApiKeyInput] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [duration, setDuration] = useState(6);
  const [youtubeResults, setYoutubeResults] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [youtubeApiKey, setYoutubeApiKey] = useState('');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  useEffect(() => {
    // Initialize YouTube API key
    YouTubeService.initializeApiKey();
    
    const storedApiKey = replicateService.getStoredApiKey();
    if (storedApiKey) {
      replicateService.setApiKey(storedApiKey);
      setIsConfigured(true);
    }

    // Auto-fetch YouTube videos when analysis data is available
    if (analysisTitle && analysisContent && !youtubeResults.length) {
      fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
    }
  }, [analysisTitle, analysisContent]);
  const fetchRelatedYouTubeVideos = async (title: string, content: string) => {
    setIsLoadingYoutube(true);
    try {
      let searchQuery = title;
      
      // If we have key claims from analysis, use them for better search
      if (analysisData?.analysis?.claims?.length > 0) {
        searchQuery = analysisData.analysis.claims[0]; // Use first key claim
        console.log('Searching for videos based on key claim:', searchQuery);
      } else {
        console.log('Searching for videos related to:', title);
      }
      
      const videos = await YouTubeService.searchVideos(searchQuery, 1); // Only get 1 video
      setYoutubeResults(videos);
      if (videos.length > 0) {
        setSelectedVideo(videos[0]); // Auto-select first video
      }
    } catch (error) {
      console.error('YouTube search failed:', error);
      toast({
        title: "Video Search Failed",
        description: "Could not find related videos. You can add a YouTube API key for better results.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingYoutube(false);
    }
  };
  const handleYouTubeApiKeySubmit = () => {
    if (!youtubeApiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube API key",
        variant: "destructive"
      });
      return;
    }
    YouTubeService.saveApiKey(youtubeApiKey.trim());
    setShowYouTubeApiKeyInput(false);
    setYoutubeApiKey('');

    // Refetch videos with the new API key
    if (analysisTitle && analysisContent) {
      fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
    }
    toast({
      title: "Success",
      description: "YouTube API key saved! Searching for better video results..."
    });
  };
  const handleAutoGenerate = async () => {
    if (!analysisTitle || !analysisContent || !analysisData || isGenerating) return;
    setIsGenerating(true);
    try {
      const analysisPrompt = replicateService.generateAnalysisPrompt(analysisTitle, analysisContent, analysisData.analysis);
      const videoUrl = await replicateService.generateVideo({
        prompt: analysisPrompt,
        aspectRatio: "16:9",
        duration: 10
      });
      setGeneratedVideoUrl(videoUrl);
      toast({
        title: "Analysis Video Ready",
        description: "AI generated explanation video is ready to watch!"
      });
    } catch (error) {
      console.error('Auto video generation failed:', error);
      // Don't show error toast for auto-generation to avoid annoying users
    } finally {
      setIsGenerating(false);
    }
  };
  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive"
      });
      return;
    }
    try {
      replicateService.setApiKey(apiKey.trim());
      setIsConfigured(true);
      // This function is for Replicate API key, not YouTube
      toast({
        title: "Success",
        description: "API key configured successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to configure API key",
        variant: "destructive"
      });
    }
  };
  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for video generation",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      const videoUrl = await replicateService.generateVideo({
        prompt: prompt.trim(),
        aspectRatio,
        duration
      });
      setGeneratedVideoUrl(videoUrl);
      toast({
        title: "Success",
        description: "Video generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Video generation failed",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleFindMoreVideos = async () => {
    if (analysisTitle && analysisContent) {
      setCurrentVideoIndex(0);
      const videos = await YouTubeService.searchVideos(analysisTitle, 5); // Get more videos
      setYoutubeResults(videos);
      if (videos.length > 0) {
        setSelectedVideo(videos[0]);
      }
    }
  };

  const handleNextVideo = () => {
    if (youtubeResults.length > 1) {
      const nextIndex = (currentVideoIndex + 1) % youtubeResults.length;
      setCurrentVideoIndex(nextIndex);
      setSelectedVideo(youtubeResults[nextIndex]);
    }
  };

  const handlePreviousVideo = () => {
    if (youtubeResults.length > 1) {
      const prevIndex = currentVideoIndex === 0 ? youtubeResults.length - 1 : currentVideoIndex - 1;
      setCurrentVideoIndex(prevIndex);
      setSelectedVideo(youtubeResults[prevIndex]);
    }
  };

  return (
    <div className={`card-glass overflow-hidden ${isMobile ? 'p-4' : 'p-6'} mb-6 animate-slide-in-up`}>
      {isLoadingYoutube ? (
        <div className="text-center py-12">
          <div className="loading-dots mb-4">
            <div style={{ '--delay': '0ms' } as any}></div>
            <div style={{ '--delay': '150ms' } as any}></div>
            <div style={{ '--delay': '300ms' } as any}></div>
          </div>
          <h3 className="heading-responsive text-foreground mb-2">Finding Related Videos</h3>
          <p className="body-responsive text-muted-foreground">Searching YouTube for relevant content...</p>
        </div>
      ) : selectedVideo ? (
        <div className="w-full">
          {/* Video Header */}
          <div className="flex-mobile items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              <h2 className="subheading-responsive text-foreground">Related Video Content</h2>
            </div>
            {youtubeResults.length > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousVideo}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ←
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentVideoIndex + 1} of {youtubeResults.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextVideo}
                  className="text-muted-foreground hover:text-foreground"
                >
                  →
                </Button>
              </div>
            )}
          </div>

          {/* Responsive Video Container */}
          <div className={`responsive-video mb-4 ${isMobile ? 'video-container-mobile' : ''}`}>
            <iframe
              src={selectedVideo.embedUrl}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-medium"
            />
          </div>
          
          {/* Video Info */}
          <div className="space-y-4">
            <div>
              <h3 className={`font-semibold text-foreground mb-2 leading-tight ${isMobile ? 'text-base' : 'text-lg'}`}>
                {selectedVideo.title}
              </h3>
              <div className="flex-mobile items-center text-muted-foreground text-sm">
                <span>by {selectedVideo.channelTitle}</span>
                <span>•</span>
                <span>{new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'justify-center'}`}>
              <Button 
                onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.videoId}`, '_blank')}
                size={isMobile ? "lg" : "default"}
                className="flex-1 sm:flex-none"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch on YouTube
              </Button>
              
              <Button
                onClick={handleFindMoreVideos}
                variant="outline"
                size={isMobile ? "lg" : "default"}
                className="flex-1 sm:flex-none"
              >
                <Search className="w-4 h-4 mr-2" />
                Find More Videos
              </Button>

              <Button
                onClick={() => {
                  if (analysisTitle && analysisContent) {
                    fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
                  }
                }}
                variant="ghost"
                size={isMobile ? "lg" : "default"}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Video Quality Indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>HD Quality Available</span>
            </div>
          </div>
        </div>
      ) : youtubeResults.length === 0 && analysisTitle ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <Play className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="heading-responsive text-foreground mb-2">No Videos Found</h3>
          <p className="body-responsive text-muted-foreground mb-6 max-w-md mx-auto">
            We couldn't find YouTube videos related to this topic. Try adding a YouTube API key for better results.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => {
                if (analysisTitle && analysisContent) {
                  fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
                }
              }}
              size={isMobile ? "lg" : "default"}
            >
              <Search className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              onClick={() => setShowYouTubeApiKeyInput(true)}
              variant="outline"
              size="sm"
              className="ml-3"
            >
              <Key className="w-4 h-4 mr-2" />
              Add API Key
            </Button>
          </div>

          {/* YouTube API Key Input */}
          {showYouTubeApiKeyInput && (
            <div className="mt-6 p-4 bg-muted rounded-lg space-y-3">
              <Label htmlFor="youtube-api-key" className="text-sm font-medium">
                YouTube API Key
              </Label>
              <Input
                id="youtube-api-key"
                type="password"
                placeholder="Enter your YouTube API key"
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                className="bg-background"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleYouTubeApiKeySubmit}
                  size="sm"
                  className="flex-1"
                >
                  Save Key
                </Button>
                <Button
                  onClick={() => setShowYouTubeApiKeyInput(false)}
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-responsive text-foreground mb-2">Loading Video Content</h3>
          <p className="body-responsive text-muted-foreground">Searching for related videos...</p>
        </div>
      )}
    </div>
  );
};