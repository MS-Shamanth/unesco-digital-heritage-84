import { ArrowLeft, User, Edit, Settings, Sun, TreePine, Shield, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

export const ProfileSettings = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    bio: "Media literacy enthusiast passionate about fighting misinformation"
  });
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated!",
      description: "Your profile changes have been saved successfully.",
    });
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-inter font-bold text-xl text-[#2D3A8C] dark:text-white">Profile Settings</h1>
        </div>
      </div>

      <main className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Edit Profile Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white">Edit Profile</h2>
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>

            {/* Profile Avatar */}
            <div className="flex justify-center mb-6">
              <Avatar className="w-20 h-20 bg-[#2D3A8C]">
                <AvatarFallback className="bg-[#2D3A8C] text-white text-2xl">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Name</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300">{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300">{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                    className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white resize-none h-20 focus:outline-none focus:ring-2 focus:ring-[#2D3A8C] focus:border-transparent"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-300">{profile.bio}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons for Edit Mode */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSave}
                    className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* App Settings Section */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-[#2D3A8C] dark:text-blue-400" />
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white">App Settings</h2>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-[#F59E0B]" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</div>
                </div>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* View Your Tree Button */}
        <Button 
          onClick={() => setLocation('/tree')}
          className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white rounded-2xl py-4 h-auto flex items-center gap-3"
        >
          <TreePine className="w-5 h-5" />
          <span className="font-semibold">View Your Tree</span>
        </Button>

        {/* Quick Actions */}
        <div className="space-y-3">
          {/* Privacy Settings */}
          <Button 
            onClick={() => setLocation('/privacy-settings')}
            variant="outline" 
            className="w-full justify-start rounded-2xl py-4 h-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Shield className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Privacy Settings</span>
          </Button>

          {/* Help & Support */}
          <Button 
            onClick={() => setLocation('/help-support')}
            variant="outline" 
            className="w-full justify-start rounded-2xl py-4 h-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <HelpCircle className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Help & Support</span>
          </Button>

          {/* Sign Out */}
          <Button 
            onClick={() => {
              toast({
                title: "Signed Out",
                description: "You have been successfully signed out.",
              });
              setLocation('/');
            }}
            variant="outline" 
            className="w-full justify-start rounded-2xl py-4 h-auto border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </Button>
        </div>
      </main>
    </div>
  );
};