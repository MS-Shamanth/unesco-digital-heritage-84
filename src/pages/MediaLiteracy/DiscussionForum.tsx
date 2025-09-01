import { ArrowLeft, MessageSquare, Plus, Heart, MessageCircle, Share, Bell, User, Video, FileText, Image, Home, Gamepad2, TreePine, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const DiscussionForum = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
    category: "General"
  });
  const { toast } = useToast();

  // Load discussions from localStorage on component mount
  useEffect(() => {
    const savedDiscussions = localStorage.getItem('discussions');
    if (savedDiscussions) {
      try {
        setDiscussions(JSON.parse(savedDiscussions));
      } catch (error) {
        console.error('Failed to parse discussions:', error);
        setDiscussions(getDefaultDiscussions());
      }
    } else {
      setDiscussions(getDefaultDiscussions());
    }
  }, []);

  const getDefaultDiscussions = () => [
    {
      id: 1,
      category: "Video Analysis",
      title: "How to identify deepfakes in political videos?",
      description: "With the rise of AI-generated content, what are the key indicators we should look for when evaluating political video content?",
      author: "Sarah Chen",
      timeAgo: "2 hours ago",
      likes: 45,
      comments: 23,
      isUserPost: false,
      image: null
    },
    {
      id: 2,
      category: "Text Analysis",
      title: "Bias detection in news headlines",
      description: "I noticed some patterns in how different news outlets frame the same story. Anyone else exploring bias detection techniques?",
      author: "Mike Rodriguez",
      timeAgo: "4 hours ago",
      likes: 32,
      comments: 18,
      isUserPost: false,
      image: null
    },
    {
      id: 3,
      category: "Media Analysis",
      title: "Understanding source credibility in digital age",
      description: "How do we evaluate the credibility of online sources when traditional gatekeepers are no longer the only option?",
      author: "You",
      timeAgo: "1 day ago",
      likes: 28,
      comments: 15,
      isUserPost: true,
      image: null
    }
  ];

  const handleCreateDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.description.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "Both title and description are required.",
        variant: "destructive",
      });
      return;
    }

    const discussion = {
      id: Date.now(),
      category: newDiscussion.category,
      title: newDiscussion.title,
      description: newDiscussion.description,
      author: "You",
      timeAgo: "Just now",
      likes: 0,
      comments: 0,
      isUserPost: true,
      image: attachedImage
    };

    const updatedDiscussions = [discussion, ...discussions];
    setDiscussions(updatedDiscussions);
    localStorage.setItem('discussions', JSON.stringify(updatedDiscussions));

    // Reset form
    setNewDiscussion({ title: "", description: "", category: "General" });
    setAttachedImage(null);
    setIsCreateModalOpen(false);

    toast({
      title: "Discussion Created!",
      description: "Your discussion has been posted successfully.",
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Video Analysis":
        return <Video className="w-4 h-4" />;
      case "Text Analysis":
        return <FileText className="w-4 h-4" />;
      case "Media Analysis":
        return <Image className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Video Analysis":
        return "bg-purple-100 text-purple-700";
      case "Text Analysis":
        return "bg-blue-100 text-blue-700";
      case "Media Analysis":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredDiscussions = activeTab === "yours" 
    ? discussions.filter(d => d.isUserPost)
    : discussions;

  const userDiscussionsCount = discussions.filter(d => d.isUserPost).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-inter font-bold text-xl text-gray-900">Discussion Forum</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4">
          <TabsList className="grid w-full grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#2D3A8C] data-[state=active]:text-[#2D3A8C] rounded-none pb-3"
            >
              All Discussions
            </TabsTrigger>
            <TabsTrigger 
              value="yours"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#2D3A8C] data-[state=active]:text-[#2D3A8C] rounded-none pb-3"
            >
              Your Discussions ({userDiscussionsCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {filteredDiscussions.map((discussion) => (
          <Card key={discussion.id} className="bg-white shadow-sm rounded-2xl border border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              {/* Category and Share */}
              <div className="flex items-center justify-between mb-3">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getCategoryColor(discussion.category)}`}>
                  {getCategoryIcon(discussion.category)}
                  {discussion.category}
                </div>
                <Button variant="ghost" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </div>

              {/* Title */}
              <h3 className="font-inter font-bold text-lg text-gray-900 mb-2">
                {discussion.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {discussion.description}
              </p>

              {/* Image Preview */}
              {discussion.image && (
                <div className="mb-4">
                  <img 
                    src={discussion.image} 
                    alt="Discussion attachment" 
                    className="rounded-lg max-w-full h-auto max-h-64 object-cover border border-gray-200"
                  />
                </div>
              )}

              {/* Author and engagement */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  by {discussion.author} • {discussion.timeAgo}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{discussion.likes}</span>
                  </div>
                   <div className="flex items-center gap-1 text-gray-500">
                     <MessageCircle className="w-4 h-4" />
                     <span className="text-sm">{discussion.comments}</span>
                   </div>
                 </div>
               </div>

               {/* Reply Input for all posts */}
               <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                 <Button variant="ghost" size="sm" className="text-[#2ECC71]">
                   <Heart className="w-4 h-4 mr-1" />
                   Like
                 </Button>
                 <Button variant="ghost" size="sm" className="text-gray-600">
                   <MessageCircle className="w-4 h-4 mr-1" />
                   Reply
                 </Button>
                 <div className="flex-1">
                   <Input 
                     placeholder="Add a reply..." 
                     className="text-sm bg-gray-50 border-gray-200"
                     value={discussion.replyText || ''}
                     onChange={(e) => {
                       const updatedDiscussions = discussions.map(d => 
                         d.id === discussion.id ? { ...d, replyText: e.target.value } : d
                       );
                       setDiscussions(updatedDiscussions);
                     }}
                   />
                 </div>
                 <Button 
                   size="sm" 
                   className="bg-[#9CA3AF] hover:bg-[#6B7280] text-white"
                   onClick={() => {
                     const replyText = discussion.replyText?.trim();
                     if (replyText) {
                       const updatedDiscussions = discussions.map(d => {
                         if (d.id === discussion.id) {
                           const replies = d.replies || [];
                           const newReply = {
                             id: Date.now(),
                             text: replyText,
                             author: "You",
                             timeAgo: "Just now"
                           };
                           return {
                             ...d,
                             replies: [...replies, newReply],
                             comments: d.comments + 1,
                             replyText: ''
                           };
                         }
                         return d;
                       });
                       setDiscussions(updatedDiscussions);
                       localStorage.setItem('discussions', JSON.stringify(updatedDiscussions));
                       
                       toast({
                         title: "Reply Posted!",
                         description: "Your reply has been added successfully.",
                       });
                     }
                   }}
                 >
                   Post
                 </Button>
               </div>

               {/* Show Replies */}
               {discussion.replies && discussion.replies.length > 0 && (
                 <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-100">
                   {discussion.replies.map((reply: any) => (
                     <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                       <div className="text-sm text-gray-800">{reply.text}</div>
                       <div className="text-xs text-gray-500 mt-1">
                         by {reply.author} • {reply.timeAgo}
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button
            onClick={() => setLocation('/dashboard')}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100"
          >
            <Home className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Home</span>
          </Button>

          <Button
            onClick={() => setLocation('/game')}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100"
          >
            <Gamepad2 className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Game</span>
          </Button>

          <Button
            onClick={() => setLocation('/tree')}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100"
          >
            <TreePine className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Tree</span>
          </Button>

          <Button
            onClick={() => setLocation('/discussion')}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] bg-blue-50"
          >
            <MessageSquare className="w-5 h-5 text-[#2D3A8C]" />
            <span className="text-xs font-inter text-[#2D3A8C]">Discussion</span>
          </Button>

          <Button
            onClick={() => setLocation('/saved')}
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100"
          >
            <Save className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Saved</span>
          </Button>
        </div>
      </div>

      {/* Floating Action Button */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogTrigger asChild>
          <Button 
            className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[#2D3A8C] hover:bg-[#252F75] text-white shadow-lg"
            size="sm"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-inter font-bold">Create New Discussion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Title</label>
              <Input 
                placeholder="Enter discussion title..."
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({...newDiscussion, title: e.target.value})}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
              <Textarea 
                placeholder="Enter discussion description..."
                value={newDiscussion.description}
                onChange={(e) => setNewDiscussion({...newDiscussion, description: e.target.value})}
                rows={4}
              />
            </div>

            {/* Attach Media */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Attach Media (Optional)</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                className="hidden"
                id="media-upload"
              />
              <label 
                htmlFor="media-upload"
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center block cursor-pointer hover:border-gray-400 transition-colors"
              >
                {attachedImage ? (
                  <div className="space-y-2">
                    <img src={attachedImage} alt="Preview" className="max-w-full h-24 object-cover mx-auto rounded" />
                    <p className="text-sm text-gray-500">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-8 h-8 mx-auto mb-2 text-gray-400">
                      <Image className="w-full h-full" />
                    </div>
                    <p className="text-sm text-gray-500">Click to attach image or video</p>
                  </div>
                )}
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1 bg-[#2D3A8C] hover:bg-[#252F75] text-white"
                onClick={handleCreateDiscussion}
              >
                Create Discussion
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};