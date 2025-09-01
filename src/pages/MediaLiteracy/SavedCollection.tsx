import { ArrowLeft, Bookmark, Search, Eye, Trash2, Globe, Home, Gamepad2, TreePine, MessageSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { SaveService, SavedItem } from "@/services/saveService";
import { useToast } from "@/hooks/use-toast";
import { CacheClearService } from "@/utils/clearCache";
import { CacheService } from "@/services/cacheService";

export const SavedCollection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Clear old cache format on component mount to ensure compatibility
    CacheClearService.clearSpecificCache('media_analysis_cache');
    
    // Load saved items
    let items = SaveService.getSavedItems();
    if (items.length === 0) {
      const mainDashboardItems = localStorage.getItem('savedItems');
      if (mainDashboardItems) {
        try {
          items = JSON.parse(mainDashboardItems);
        } catch (error) {
          console.error('Failed to parse saved items:', error);
        }
      }
    }
    setSavedItems(items);
  }, []);

  const handleDelete = (itemId: string) => {
    SaveService.deleteSavedItem(itemId);
    setSavedItems(SaveService.getSavedItems());
    toast({
      title: "Item Deleted",
      description: "Saved item has been removed from your collection.",
    });
  };

  const handleViewMore = (item: SavedItem) => {
    console.log('SavedCollection - Original item:', item);
    console.log('SavedCollection - item.simpleRewrite:', item.simpleRewrite);
    console.log('SavedCollection - item.otherSources:', item.otherSources);
    
    // Store the item in the proper cache format that ExtendedView expects
    // Provide defaults for missing fields
    const simpleRewrite = item.simpleRewrite || (item as any).simpleRewrite || "";
    const otherSources = item.otherSources || (item as any).otherSources || [];
    const biasCheck = item.biasCheck || (item as any).biasCheck || "";
    const credibilityScore = item.credibilityScore || (item as any).credibilityScore || "";
    
    console.log('SavedCollection - Using values:', { simpleRewrite, otherSources, biasCheck, credibilityScore });
    
    // Use CacheService to properly save the analysis so ExtendedView can find it
    CacheService.saveAnalysis(
      item.title, 
      item.content, 
      item.analysis, 
      item.url, 
      item.domain,
      simpleRewrite,
      otherSources,
      biasCheck,
      credibilityScore
    );
    
    console.log('SavedCollection - Saved analysis to cache for ExtendedView');
    setLocation('/extended');
  };

  const filteredItems = savedItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBiasColor = (biasLevel: string) => {
    switch (biasLevel) {
      case "Low Bias": return "bg-green-500";
      case "Moderate Bias": return "bg-yellow-500";
      case "High Bias": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-inter font-bold text-xl text-[#2D3A8C] dark:text-white">Saved Collection</h1>
        </div>
      </div>

      <main className="p-6 pb-24">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search saved items..."
              className="pl-10 rounded-[15px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-[20px] border border-gray-200 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-[#2ECC71]" />
              <h2 className="font-inter font-bold text-2xl text-gray-900 dark:text-white mb-4">
                Your Saved Items
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {savedItems.length === 0 
                  ? "Analyses you save will appear here for future reference"
                  : "No items match your search query"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-[20px] border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Saved on {new Date(item.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getBiasColor(item.analysis.biasLevel)} text-white px-3 py-1`}>
                      {item.analysis.biasLevel}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {item.content.slice(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.confidence}% credible • {item.analysis.factuality}% factual
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewMore(item)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View More
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100 dark:hover:bg-gray-700">
            <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-xs font-inter text-gray-600 dark:text-gray-300">Home</span>
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

          <Button onClick={() => setLocation('/saved')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] bg-blue-50 dark:bg-blue-900/20">
            <Save className="w-5 h-5 text-[#2D3A8C] dark:text-blue-400" />
            <span className="text-xs font-inter text-[#2D3A8C] dark:text-blue-400">Saved</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
