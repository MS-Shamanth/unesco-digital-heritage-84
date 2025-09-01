import { Link, Camera, Mic, Image, Upload, Menu, User, Gamepad2, TreePine, MessageSquare, Save, Eye, Edit, Settings, Moon, Sun, X, Share, Plus, Bell, Bookmark, Search, AlertTriangle, CheckCircle, XCircle, Clock, Home, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { mediaApi, type MediaAnalysisResponse } from "@/lib/api";
import { useDemo } from "@/hooks/useDemo";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
export const MainDashboard = (): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<MediaAnalysisResponse | null>(null);
  const [savedItems, setSavedItems] = useState<MediaAnalysisResponse[]>([]);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [, setLocation] = useLocation();
  const {
    isLoggedIn,
    user
  } = useDemo();
  const [callsRemaining, setCallsRemaining] = useState(5);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const {
    toast
  } = useToast();
  const { isDarkMode } = useTheme();

  // Load saved items from localStorage and check API status on component mount
  useEffect(() => {
    // Clear old cache format to ensure compatibility with new API
    try {
      localStorage.removeItem('media_literacy_cache');
      localStorage.removeItem('media_analysis_cache');
    } catch (error) {
      console.error('Error clearing old cache:', error);
    }
    
    const saved = localStorage.getItem('savedItems');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to parse saved items:', error);
      }
    }

    // Update calls remaining
    setCallsRemaining(mediaApi.getCallsRemaining());
  }, []);

  // Check if input is a valid URL
  useEffect(() => {
    try {
      const url = new URL(inputValue);
      setIsValidUrl(url.protocol === 'http:' || url.protocol === 'https:');
    } catch {
      setIsValidUrl(false);
    }
  }, [inputValue]);
  const handleSave = () => {
    if (analysisResult) {
      const newSavedItems = [analysisResult, ...savedItems];
      setSavedItems(newSavedItems);
      localStorage.setItem('savedItems', JSON.stringify(newSavedItems));
      toast({
        title: "Content Saved!",
        description: "Analysis has been added to your saved collection."
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUploadDropdown) {
        setShowUploadDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUploadDropdown]);
  const analysisMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
      mediaType: string;
      sourceUrl?: string;
    }) => {
      return await mediaApi.analyze({
        ...data,
        userId: user?.id || "guest"
      });
    },
    onSuccess: result => {
      setAnalysisResult(result);
      setShowResult(true);
      setIsAnalyzing(false);
      setCallsRemaining(mediaApi.getCallsRemaining());

      // Show cache status if from cache
      const cacheStats = mediaApi.getCacheStats();
      if (cacheStats.total > 0) {
        toast({
          title: "Analysis Complete",
          description: result.analysis.biasRationale.includes("cache") ? "Results loaded from cache" : "New analysis completed"
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze media content",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      setCallsRemaining(mediaApi.getCallsRemaining());
    }
  });
  const handleAnalyze = () => {
    if (inputValue.trim()) {
      if (callsRemaining <= 0) {
        toast({
          title: "API Limit Reached",
          description: "Maximum 5 analyses per session. Refresh to reset.",
          variant: "destructive"
        });
        return;
      }
      setIsAnalyzing(true);
      
      // Send to Zapier webhook for YouTube search
      sendToZapierWebhook(inputValue.trim());
      
      if (isValidUrl) {
        // Analyze URL content
        analysisMutation.mutate({
          title: "URL Analysis",
          content: "",
          mediaType: "article",
          sourceUrl: inputValue.trim()
        });
      } else {
        // Analyze direct text input
        analysisMutation.mutate({
          title: "Text Analysis",
          content: inputValue.trim(),
          mediaType: "article"
        });
      }
    }
  };

  const sendToZapierWebhook = async (query: string) => {
    try {
      const webhookUrl = process.env.ZAPIER_WEBHOOK_URL || 'https://hooks.zapier.com/hooks/catch/24333177/ut0unhe/';
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          query: query
        }),
      });

      // Store the query for the VideoGenerator to use
      localStorage.setItem('lastYouTubeQuery', query);
      
    } catch (error) {
      console.error('Error sending to Zapier webhook:', error);
    }
  };
  const getBiasColor = (score: number) => {
    if (score >= 80) return "#DC2626"; // Red for high bias
    if (score >= 60) return "#F59E0B"; // Orange for moderate bias
    return "#10B981"; // Green for low bias
  };
  const getBiasLabel = (biasLevel: string) => biasLevel;
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Negative':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // --- New state and handlers for profile drawer ---
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const handleProfileClick = () => {
    setLocation('/profile-settings');
  };
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="font-inter font-bold text-xl text-[#2D3A8C] dark:text-white">InfoShield</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {callsRemaining} calls left
            </Badge>
            <Button onClick={() => setLocation('/notifications')} variant="ghost" className="p-2">
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Button>
            <Button onClick={handleProfileClick} variant="ghost" className="p-2">
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 pb-24">
          {/* Input Section */}
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-[20px] border border-gray-200 dark:border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-inter font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Paste link or upload content
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Enter URL, paste text, or upload media..." className="w-full pl-10 pr-16 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-[15px] font-inter text-sm focus:outline-none focus:ring-2 focus:ring-[#2D3A8C] focus:border-transparent" />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="relative">
                        <Button onClick={e => {
                      e.stopPropagation();
                      setShowUploadDropdown(!showUploadDropdown);
                    }} size="sm" variant="ghost" className="p-1 h-8 w-8 rounded-full bg-[#2D3A8C] hover:bg-[#252F75] text-white">
                          <Plus className="w-4 h-4" />
                        </Button>

                        {showUploadDropdown && <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-[12px] shadow-xl py-2 z-50 min-w-[160px]">
                            <button onClick={() => {
                        // Handle file upload (all types)
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,video/*,audio/*';
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files && files.length > 0) {
                            toast({
                              title: "Files Selected",
                              description: `${files.length} file(s) ready for upload`
                            });
                          }
                        };
                        input.click();
                        setShowUploadDropdown(false);
                      }} className="w-full px-4 py-2 text-left text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                              <Folder className="w-4 h-4 text-[#2D3A8C]" />
                              Upload Files
                            </button>
                            <button onClick={() => {
                        // Handle camera access
                        navigator.mediaDevices?.getUserMedia({
                          video: true
                        }).then(() => {
                          toast({
                            title: "Camera Access",
                            description: "Camera permissions granted"
                          });
                        }).catch(() => {
                          toast({
                            title: "Camera Error",
                            description: "Unable to access camera",
                            variant: "destructive"
                          });
                        });
                        setShowUploadDropdown(false);
                      }} className="w-full px-4 py-2 text-left text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                              <Camera className="w-4 h-4 text-[#2D3A8C]" />
                              Open Camera
                            </button>
                            <button onClick={() => {
                        // Handle audio recording
                        navigator.mediaDevices?.getUserMedia({
                          audio: true
                        }).then(() => {
                          toast({
                            title: "Microphone Access",
                            description: "Microphone permissions granted"
                          });
                        }).catch(() => {
                          toast({
                            title: "Microphone Error",
                            description: "Unable to access microphone",
                            variant: "destructive"
                          });
                        });
                        setShowUploadDropdown(false);
                      }} className="w-full px-4 py-2 text-left text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors">
                              <Mic className="w-4 h-4 text-[#2D3A8C]" />
                              Record Audio
                            </button>
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <Button onClick={handleAnalyze} disabled={!inputValue.trim() || isAnalyzing || callsRemaining <= 0} className="flex-1 bg-[#2D3A8C] hover:bg-[#252F75] text-white rounded-[15px] py-3 font-inter font-semibold disabled:bg-gray-300">
                    {isAnalyzing ? "Analyzing..." : isValidUrl ? "Analyze URL" : "Analyze Text"}
                  </Button>
                  {isValidUrl && <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      URL Detected
                    </Badge>}
                </div>
                
                {callsRemaining <= 2 && callsRemaining > 0 && <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-300 p-2 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Only {callsRemaining} analysis remaining this session</span>
                  </div>}
                
                {callsRemaining === 0 && <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-2 rounded-lg">
                    <XCircle className="w-4 h-4" />
                    <span>API limit reached. Refresh page to reset.</span>
                  </div>}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {showResult && analysisResult && <div className="space-y-4">
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white mb-4">
                Analysis Results
              </h2>

              <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-[20px] border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Bias Level */}
                  <div className="mb-2">
                    <Badge className="text-white font-medium text-sm px-3 py-1 rounded-full" style={{
                backgroundColor: getBiasColor(analysisResult.analysis.overallScore)
              }}>
                      {getBiasLabel(analysisResult.analysis.biasLevel)}
                    </Badge>
                  </div>
                  
                  {/* Credibility */}
                  <div className="mb-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Math.round(analysisResult.analysis.credibility)}% credible
                    </span>
                  </div>
                  
                  {/* Domain */}
                  {analysisResult.domain && <div className="mb-3">
                      <span className="text-[#2D3A8C] dark:text-blue-400 font-medium">{analysisResult.domain}</span>
                    </div>}
                  
                  {/* Title */}
                  <h3 className="font-inter font-bold text-lg text-gray-900 dark:text-white leading-tight mb-3">
                    {analysisResult.title}
                  </h3>
                  
                  {/* Type and Sentiment */}
                  <div className="mb-3">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                      Type: {analysisResult.url ? 'url' : 'text'} • Sentiment: {analysisResult.analysis.sentiment}
                    </span>
                  </div>
                  
                  {/* URL if available */}
                  {analysisResult.url && <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <a href={analysisResult.url} target="_blank" rel="noopener noreferrer" className="text-[#2D3A8C] dark:text-blue-400 text-sm underline break-all hover:text-[#1e2761] dark:hover:text-blue-300">
                        {analysisResult.url}
                      </a>
                    </div>}
                  
                  {/* Rationale */}
                  <div className="mb-4">
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {analysisResult.analysis.credibilityRationale}
                    </p>
                  </div>
                  
                  {/* Key Claims */}
                  {analysisResult.analysis.claims.length > 0 && <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Claims:</h4>
                      <ul className="space-y-1">
                        {analysisResult.analysis.claims.slice(0, 3).map((claim, index) => <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <span className="text-[#2D3A8C] dark:text-blue-400 mt-1 font-bold">•</span>
                            <span className="text-sm">{claim}</span>
                          </li>)}
                      </ul>
                    </div>}
                  
                  {/* Scores */}
                  <div className="mb-6 text-gray-800 dark:text-gray-200 font-medium">
                    <span>Overall: {Math.round(analysisResult.analysis.overallScore)}/100</span>
                    <br />
                    <span>Factuality: {Math.round(analysisResult.analysis.factuality)}/100</span>
                  </div>
                  
                  {/* Safety Flags if any */}
                  {analysisResult.analysis.safetyFlags.length > 0 && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-semibold text-red-800 dark:text-red-300">Safety Flags</span>
                      </div>
                      <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {analysisResult.analysis.safetyFlags.map((flag, index) => <li key={index}>• {flag}</li>)}
                      </ul>
                    </div>}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" variant="outline" className="border-[#2ECC71] text-[#2ECC71] hover:bg-[#2ECC71] hover:text-white rounded-[8px]">
                      Save
                    </Button>
                    <Button size="sm" onClick={() => setShowShareModal(true)} className="bg-[#FFA726] hover:bg-[#FF9800] text-white font-inter font-medium rounded-[8px]">
                      Share
                    </Button>
                    <Button size="sm" onClick={() => setLocation('/extended')} className="bg-[#004E98] hover:bg-[#003875] text-white font-inter font-medium rounded-[8px]">
                      View More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>}

          {/* Saved Collection */}
          <div className="mb-8">
            <h3 className="font-inter font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#2ECC71]" />
              Saved Collection ({savedItems.length})
            </h3>
            {savedItems.length === 0 ? <div className="text-center py-8 text-gray-500">
                <Bookmark className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-inter">No saved analyses yet</p>
                <p className="font-inter text-sm">Content you save will appear here</p>
              </div> : <div className="space-y-3">
                {savedItems.slice(0, 3).map((item, index) => <Card key={index} className="bg-white dark:bg-gray-800 shadow-sm rounded-[15px] border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-inter font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#2ECC71]"></div>
                            <span>Bias: {Math.round(item.biasScore)}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[#004E98]"></div>
                            <span>Confidence: {Math.round(item.confidence)}%</span>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => {
                localStorage.setItem('currentAnalysis', JSON.stringify(item));
                setLocation('/extended');
              }} size="sm" variant="ghost" className="text-[#2D3A8C] hover:bg-[#2D3A8C]/10">
                        View
                      </Button>
                    </div>
                  </Card>)}
                {savedItems.length > 3 && <Button variant="ghost" className="w-full text-[#2D3A8C] hover:bg-[#2D3A8C]/10" onClick={() => {
            setLocation('/saved');
          }}>
                    View All ({savedItems.length})
                  </Button>}
              </div>}
          </div>
        </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] bg-blue-50 dark:bg-blue-900/20">
            <Home className="w-5 h-5 text-[#2D3A8C] dark:text-blue-400" />
            <span className="text-xs font-inter text-[#2D3A8C] dark:text-blue-400">Home</span>
          </Button>

          <Button onClick={() => setLocation('/game')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-700">
            <Gamepad2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-inter text-gray-600 dark:text-gray-300">Game</span>
          </Button>

          <Button onClick={() => setLocation('/tree')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-700">
            <TreePine className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-inter text-gray-600 dark:text-gray-300">Tree</span>
          </Button>

          <Button onClick={() => setLocation('/discussion')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-700">
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-inter text-gray-600 dark:text-gray-300">Discussion</span>
          </Button>

          <Button onClick={() => setLocation('/saved')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-700">
            <Save className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-inter text-gray-600 dark:text-gray-300">Saved</span>
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-inter font-bold text-xl text-[#2D3A8C]">Share Analysis</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-[12px]">
              <Input value="https://medialiteracy.app/analysis/abc123" readOnly className="flex-1 border-0 bg-transparent font-inter text-sm" />
              <Button size="sm" onClick={() => {
              navigator.clipboard.writeText("https://medialiteracy.app/analysis/abc123");
              toast({
                title: "Link copied to clipboard!"
              });
            }} className="bg-[#2D3A8C] hover:bg-[#1e2761] text-white rounded-[8px]">
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" className="h-12 flex flex-col items-center gap-1 rounded-[12px]">
                <span className="text-lg">📧</span>
                <span className="text-xs">Email</span>
              </Button>
              <Button variant="outline" className="h-12 flex flex-col items-center gap-1 rounded-[12px]">
                <span className="text-lg">📱</span>
                <span className="text-xs">SMS</span>
              </Button>
              <Button variant="outline" className="h-12 flex flex-col items-center gap-1 rounded-[12px]">
                <span className="text-lg">🐦</span>
                <span className="text-xs">Twitter</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>;
};