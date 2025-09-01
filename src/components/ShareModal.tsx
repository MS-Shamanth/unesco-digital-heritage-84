import { Share2, X, Copy, Facebook, Twitter, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MediaAnalysisResponse } from "@/lib/api";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: MediaAnalysisResponse;
}

export const ShareModal = ({ isOpen, onClose, analysisData }: ShareModalProps) => {
  const { toast } = useToast();
  
  const shareUrl = window.location.href;
  const shareText = `Check out this media analysis: "${analysisData.title}" - ${analysisData.analysis.biasLevel} with ${analysisData.confidence}% credibility.`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(`Media Analysis: ${analysisData.title}`)}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Media Analysis: ${analysisData.title}`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Analysis
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Social Media Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share on Social Media</label>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={() => handleSocialShare('twitter')} 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                Twitter
              </Button>
              <Button 
                onClick={() => handleSocialShare('facebook')} 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                Facebook
              </Button>
              <Button 
                onClick={() => handleSocialShare('whatsapp')} 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                WhatsApp
              </Button>
              <Button 
                onClick={() => handleSocialShare('email')} 
                variant="outline" 
                className="flex items-center gap-2 justify-start"
              >
                <Mail className="w-4 h-4 text-gray-600" />
                Email
              </Button>
            </div>
          </div>

          {/* Native Share (if available) */}
          {navigator.share && (
            <div className="space-y-2">
              <Button onClick={handleNativeShare} className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share via Device Apps
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};