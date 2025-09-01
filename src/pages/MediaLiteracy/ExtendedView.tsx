import { ArrowLeft, Share, Globe, ExternalLink, Play, ToggleLeft, ToggleRight, Bell, Save, Trash2, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { mediaApi, MediaAnalysisResponse } from "@/lib/api";
import { CacheService } from "@/services/cacheService";
import { SaveService } from "@/services/saveService";
import { GenerationalRewriteService, GenerationalContent } from "@/services/generationalRewrite";
import { ShareModal } from "@/components/ShareModal";
import { VideoGenerator } from "@/components/VideoGenerator";
import { useToast } from "@/hooks/use-toast";
interface RelatedSource {
  title: string;
  url: string;
  credibility: "High" | "Medium" | "Low";
  domain: string;
}
export const ExtendedView = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [analysisData, setAnalysisData] = useState<MediaAnalysisResponse | null>(null);
  const [generationalContent, setGenerationalContent] = useState<GenerationalContent | null>(null);
  const [relatedSources, setRelatedSources] = useState<RelatedSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerationalRewrite, setShowGenerationalRewrite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    console.log('ExtendedView loading, checking for cached data...');

    // Get the latest analysis from cache (don't clear it immediately)
    const stats = CacheService.getCacheStats();
    console.log('Cache stats:', stats);
    if (stats.total > 0) {
      const allAnalyses = CacheService.getAllAnalyses();
      const cacheData = allAnalyses[0]; // Get most recent
      console.log('Found cached data:', cacheData);
      if (cacheData) {
        // Extract bias score from API bias_check (format: "Bias Score: 2/10")
        const extractBiasScore = (biasCheck: string) => {
          if (!biasCheck) return cacheData.analysis.overallScore;
          const match = biasCheck.match(/Bias Score: (\d+)\/10/);
          return match ? parseInt(match[1]) : cacheData.analysis.overallScore;
        };

        // Extract credibility percentage from API credibility_score (format: "Score: 75%")
        const extractCredibilityScore = (credibilityScore: string) => {
          if (!credibilityScore) return cacheData.analysis.credibility;
          const match = credibilityScore.match(/Score: (\d+)%/);
          return match ? parseInt(match[1]) : cacheData.analysis.credibility;
        };
        const data = {
          id: cacheData.id,
          title: cacheData.title,
          content: cacheData.content,
          url: cacheData.url,
          domain: cacheData.domain,
          biasScore: extractBiasScore(cacheData.biasCheck || ''),
          confidence: extractCredibilityScore(cacheData.credibilityScore || ''),
          sourceUrl: cacheData.url,
          mediaType: "article",
          analysis: cacheData.analysis,
          timestamp: new Date(cacheData.timestamp),
          simpleRewrite: cacheData.simpleRewrite,
          otherSources: cacheData.otherSources,
          biasCheck: cacheData.biasCheck,
          credibilityScore: cacheData.credibilityScore
        };
        setAnalysisData(data);
        console.log('ExtendedView - Set analysis data:', data);
        console.log('ExtendedView - simpleRewrite:', data.simpleRewrite);
        console.log('ExtendedView - otherSources:', data.otherSources);

        // Use other sources from API if available, otherwise generate contextual sources
        if (data.otherSources && data.otherSources.length > 0) {
          console.log('Using API other sources:', data.otherSources);
          generateSourcesFromAPI(data.otherSources);
        } else {
          console.log('No API sources, generating contextual sources');
          generateRelatedSources(cacheData.title, cacheData.content);
        }

        // Only generate generational rewrite if no simple rewrite from API
        if (!data.simpleRewrite) {
          generateGenerationalRewrite(cacheData.title, cacheData.content);
        }

        // Check if item is already saved
        const savedItems = SaveService.getSavedItems();
        setIsSaved(savedItems.some(item => item.id === cacheData.id));
      }
    } else {
      console.log('No cached data found');
    }
    setLoading(false);
  }, []);
  const generateSourcesFromAPI = (otherSources: string[]) => {
    const sources: RelatedSource[] = otherSources.map((url, index) => {
      try {
        const domain = new URL(url).hostname;
        const title = `Related Article ${index + 1} - ${domain}`;
        return {
          title,
          url,
          credibility: "High" as const,
          domain
        };
      } catch (error) {
        return {
          title: `Related Source ${index + 1}`,
          url,
          credibility: "Medium" as const,
          domain: "unknown"
        };
      }
    });
    setRelatedSources(sources);
  };
  const generateRelatedSources = (title: string, content: string) => {
    // Generate contextually relevant sources based on content keywords
    const lowerTitle = (title || "").toLowerCase();
    const lowerContent = (content || "").toLowerCase();
    const fullText = `${lowerTitle} ${lowerContent}`;
    let sources: RelatedSource[] = [];

    // Technology-related content
    if (fullText.includes('ai') || fullText.includes('artificial intelligence') || fullText.includes('technology') || fullText.includes('tech') || fullText.includes('robot') || fullText.includes('digital')) {
      sources = [{
        title: "BBC Technology - AI & Innovation",
        url: "https://www.bbc.com/news/technology",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Technology News",
        url: "https://www.reuters.com/technology/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "CNN Tech Coverage",
        url: "https://edition.cnn.com/business/tech",
        credibility: "High",
        domain: "cnn.com"
      }, {
        title: "Associated Press Tech News",
        url: "https://apnews.com/hub/technology",
        credibility: "High",
        domain: "apnews.com"
      }];
    }
    // Climate/Environment related content
    else if (fullText.includes('climate') || fullText.includes('environment') || fullText.includes('carbon') || fullText.includes('global warming') || fullText.includes('weather') || fullText.includes('renewable')) {
      sources = [{
        title: "BBC Climate & Environment",
        url: "https://www.bbc.com/news/science-environment",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Climate Coverage",
        url: "https://www.reuters.com/business/environment/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "CNN Climate News",
        url: "https://edition.cnn.com/specials/world/cnn-climate",
        credibility: "High",
        domain: "cnn.com"
      }, {
        title: "Associated Press Climate",
        url: "https://apnews.com/hub/climate-and-environment",
        credibility: "High",
        domain: "apnews.com"
      }];
    }
    // Health/Medical content
    else if (fullText.includes('health') || fullText.includes('medical') || fullText.includes('vaccine') || fullText.includes('pandemic') || fullText.includes('disease') || fullText.includes('hospital')) {
      sources = [{
        title: "BBC Health News",
        url: "https://www.bbc.com/news/health",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Health Coverage",
        url: "https://www.reuters.com/business/healthcare-pharmaceuticals/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "CNN Health",
        url: "https://edition.cnn.com/health",
        credibility: "High",
        domain: "cnn.com"
      }, {
        title: "Associated Press Health",
        url: "https://apnews.com/hub/health",
        credibility: "High",
        domain: "apnews.com"
      }];
    }
    // Political/Government content
    else if (fullText.includes('politics') || fullText.includes('government') || fullText.includes('election') || fullText.includes('policy') || fullText.includes('president') || fullText.includes('congress')) {
      sources = [{
        title: "BBC Politics",
        url: "https://www.bbc.com/news/politics",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Politics",
        url: "https://www.reuters.com/world/us/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "Associated Press Politics",
        url: "https://apnews.com/hub/politics",
        credibility: "High",
        domain: "apnews.com"
      }, {
        title: "CNN Politics",
        url: "https://edition.cnn.com/politics",
        credibility: "High",
        domain: "cnn.com"
      }];
    }
    // Business/Economic content
    else if (fullText.includes('economy') || fullText.includes('business') || fullText.includes('market') || fullText.includes('financial') || fullText.includes('stock') || fullText.includes('trading')) {
      sources = [{
        title: "BBC Business",
        url: "https://www.bbc.com/news/business",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Business",
        url: "https://www.reuters.com/business/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "CNN Business",
        url: "https://edition.cnn.com/business",
        credibility: "High",
        domain: "cnn.com"
      }, {
        title: "Associated Press Business",
        url: "https://apnews.com/hub/business",
        credibility: "High",
        domain: "apnews.com"
      }];
    }
    // Sports content
    else if (fullText.includes('sport') || fullText.includes('football') || fullText.includes('basketball') || fullText.includes('olympics') || fullText.includes('team') || fullText.includes('player')) {
      sources = [{
        title: "BBC Sport",
        url: "https://www.bbc.com/sport",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters Sports",
        url: "https://www.reuters.com/sports/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "CNN Sports",
        url: "https://edition.cnn.com/sport",
        credibility: "High",
        domain: "cnn.com"
      }, {
        title: "Associated Press Sports",
        url: "https://apnews.com/hub/sports",
        credibility: "High",
        domain: "apnews.com"
      }];
    }
    // Default major news sources
    else {
      sources = [{
        title: "BBC News - Breaking News",
        url: "https://www.bbc.com/news",
        credibility: "High",
        domain: "bbc.com"
      }, {
        title: "Reuters World News",
        url: "https://www.reuters.com/world/",
        credibility: "High",
        domain: "reuters.com"
      }, {
        title: "Associated Press News",
        url: "https://apnews.com/",
        credibility: "High",
        domain: "apnews.com"
      }, {
        title: "CNN International",
        url: "https://edition.cnn.com/",
        credibility: "High",
        domain: "cnn.com"
      }];
    }
    setRelatedSources(sources);
  };
  const generateGenerationalRewrite = (title: string, content: string) => {
    const rewriteContent = GenerationalRewriteService.generateRewrite(content, title);
    setGenerationalContent(rewriteContent);
  };
  const handleGetUpdates = () => {
    if (analysisData) {
      SaveService.subscribeToUpdates(analysisData);
      toast({
        title: "Subscribed to Updates",
        description: "You'll be notified when there are new developments on this story."
      });
    }
  };
  const handleShare = () => {
    setShowShareModal(true);
  };
  const handleSave = () => {
    if (analysisData) {
      if (isSaved) {
        SaveService.deleteSavedItem(analysisData.id);
        setIsSaved(false);
        toast({
          title: "Removed from Saved",
          description: "Analysis removed from your saved collection."
        });
      } else {
        SaveService.saveItem(analysisData);
        setIsSaved(true);
        toast({
          title: "Saved Successfully",
          description: "Analysis saved to your collection."
        });
      }
    }
  };
  const getBiasColor = (biasLevel: string) => {
    switch (biasLevel) {
      case "Low Bias":
        return "bg-green-500";
      case "Moderate Bias":
        return "bg-yellow-500";
      case "High Bias":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case "High":
        return "bg-green-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "Low":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
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
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3A8C] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analysis...</p>
        </div>
      </div>;
  }
  if (!analysisData) {
    return <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg">User Input Analysis</h1>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-600">No analysis data available</p>
        </div>
      </div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm shadow-soft border-b border-border mobile-container py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="icon" className="hover:scale-105 transition-transform">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="subheading-responsive">Analysis Details</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleShare} className="hover:scale-105 transition-transform">
            <Share className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <main className="mobile-container py-6 space-y-6">
        {/* Analysis Summary Card */}
        <Card className="card-elegant overflow-hidden animate-slide-in-up">
          <div className="bg-gradient-to-r from-primary to-primary-light p-4 sm:p-6 text-primary-foreground">
            {/* AI Video Generator */}
            <VideoGenerator analysisTitle={analysisData.title} analysisContent={analysisData.content} analysisData={analysisData} />
            
            <div className="flex-mobile items-center justify-between mb-4">
              <Badge className={`${getBiasColor(analysisData.analysis.biasLevel)} text-white px-4 py-2 rounded-full`}>
                {analysisData.analysis.biasLevel}
              </Badge>
              <span className="text-primary-foreground/80 font-semibold">{analysisData.confidence}% credible</span>
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <Globe className="w-8 h-8 flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <h2 className="subheading-responsive font-bold mb-2 text-primary-foreground break-words">
                  {analysisData.title}
                </h2>
                <p className="text-primary-foreground/80 text-sm">
                  {analysisData.mediaType} • Analysis • {analysisData.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* AI Analysis - Enhanced */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              <h3 className="font-semibold text-lg">Detailed AI Analysis</h3>
            </div>
            
            {/* Primary Analysis */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Credibility Assessment</h4>
              <p className="text-gray-600 mb-4">
                {analysisData.analysis.credibilityRationale}
              </p>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {analysisData.analysis.overallScore}
                  </div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {analysisData.confidence}
                  </div>
                  <div className="text-sm text-gray-500">Credibility</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {analysisData.analysis.factuality}
                  </div>
                  <div className="text-sm text-gray-500">Factuality</div>
                </div>
              </div>
            </div>

            {/* Bias Analysis */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Bias Analysis</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getBiasColor(analysisData.analysis.biasLevel)} text-white px-3 py-1`}>
                  {analysisData.analysis.biasLevel}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{analysisData.analysis.biasRationale}</p>
            </div>

            {/* Key Claims */}
            {analysisData.analysis.claims.length > 0 && <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Verifiable Claims</h4>
                <ul className="space-y-2">
                  {analysisData.analysis.claims.map((claim, index) => <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 mt-1 font-bold">•</span>
                      <span className="text-sm">{claim}</span>
                    </li>)}
                </ul>
              </div>}

            {/* Safety Flags */}
            {analysisData.analysis.safetyFlags.length > 0 && <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h4 className="font-medium text-red-800">Safety Concerns</h4>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {analysisData.analysis.safetyFlags.map((flag, index) => <li key={index}>• {flag}</li>)}
                </ul>
              </div>}

            {/* Source Analysis */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Source Reliability</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Sentiment</div>
                  <div className="font-medium text-gray-900 flex items-center gap-1">
                    {getSentimentIcon(analysisData.analysis.sentiment)}
                    {analysisData.analysis.sentiment}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Domain</div>
                  <div className="font-medium text-gray-900">{analysisData.domain}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simple Rewrite */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Simple Rewrite</h3>
              
            </div>
            
            {/* Show simple rewrite from API if available */}
            {analysisData.simpleRewrite ? <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 mb-4">
                <h4 className="font-medium mb-2 text-blue-700">Simplified Version</h4>
                <p className="text-sm text-gray-700">{analysisData.simpleRewrite}</p>
              </div> : <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400 mb-4">
                <h4 className="font-medium mb-2 text-gray-700">Simple Rewrite</h4>
                <p className="text-sm text-gray-600">No simplified version available from source</p>
              </div>}
            
            {/* Fallback generational content */}
            {showGenerationalRewrite && generationalContent && <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-medium mb-2 text-green-700">For Children (8-12)</h4>
                  <p className="text-sm text-gray-700">{generationalContent.children}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-medium mb-2 text-blue-700">For Teens (13-17)</h4>
                  <p className="text-sm text-gray-700">{generationalContent.teens}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                  <h4 className="font-medium mb-2 text-purple-700">For Adults (18+)</h4>
                  <p className="text-sm text-gray-700">{generationalContent.adults}</p>
                </div>
              </div>}
          </CardContent>
        </Card>

        {/* Related Sources */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Related Sources</h3>
            <p className="text-gray-600 mb-4">
              {analysisData.otherSources && analysisData.otherSources.length > 0 ? "Additional sources found for this story" : "Cross-reference this story across multiple reliable sources"}
            </p>
            <div className="space-y-3">
              {relatedSources.map((source, index) => <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{source.title}</div>
                      <div className="text-sm text-gray-500">{source.url}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCredibilityColor(source.credibility)}>
                      {source.credibility}
                    </Badge>
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </a>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleGetUpdates} className="w-full bg-green-500 hover:bg-green-600 text-white py-3">
            <Bell className="w-4 h-4 mr-2" />
            Get Updates
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleShare} variant="outline" className="py-3">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleSave} variant={isSaved ? "default" : "outline"} className="py-3">
              <Save className="w-4 h-4 mr-2" />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Share Modal */}
        {analysisData && <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} analysisData={analysisData} />}
      </main>
    </div>
  );
};