import React, { useState, useEffect } from 'react';
import { Play, Key, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { replicateService } from '@/services/replicateService';
import { YouTubeService } from '@/services/youtubeService';
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
  const {
    toast
  } = useToast();
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
  return <div className="bg-black/20 rounded-lg p-6 mb-4 flex items-center justify-center min-h-[300px]">
      {isLoadingYoutube ? (
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-3 text-white/70 animate-spin" />
          <p className="text-white/70 mb-2">Finding related videos...</p>
          <p className="text-white/50 text-sm">Searching YouTube for relevant content</p>
        </div>
      ) : selectedVideo ? (
        <div className="w-full max-w-4xl">
          {/* Large Video Preview */}
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <iframe
              width="100%"
              height="400"
              src={selectedVideo.embedUrl}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-[400px]"
            />
          </div>
          
          {/* Video Info */}
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {selectedVideo.title}
            </h3>
            <p className="text-white/70 text-sm mb-4">
              by {selectedVideo.channelTitle} • {new Date(selectedVideo.publishedAt).toLocaleDateString()}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.videoId}`, '_blank')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch on YouTube
              </Button>
              <Button
                onClick={() => {
                  if (analysisTitle && analysisContent) {
                    fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
                  }
                }}
                variant="outline"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Find Different Video
              </Button>
            </div>
          </div>
        </div>
      ) : youtubeResults.length === 0 && analysisTitle ? (
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-3 text-white/70" />
          <p className="text-white/70 mb-2">No related videos found</p>
          <p className="text-white/50 text-sm mb-4">We couldn't find YouTube videos for this news topic.</p>
          <Button
            onClick={() => {
              if (analysisTitle && analysisContent) {
                fetchRelatedYouTubeVideos(analysisTitle, analysisContent);
              }
            }}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <Play className="w-16 h-16 mx-auto mb-3 text-white/70" />
          <p className="text-white/70">Loading video content...</p>
          <p className="text-white/50 text-sm mt-2">Searching for related videos</p>
        </div>
      )}
    </div>;
};