import { ArrowLeft, Shield, Eye, Lock, Database, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const PrivacySettings = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: false,
    personalization: true,
    thirdPartySharing: false,
    cookiePreferences: true
  });

  const handleToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast({
      title: "Privacy Setting Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const privacyOptions = [
    {
      id: 'dataCollection' as keyof typeof privacySettings,
      icon: Database,
      title: "Data Collection",
      description: "Allow collection of usage data to improve the app experience",
      enabled: privacySettings.dataCollection
    },
    {
      id: 'analytics' as keyof typeof privacySettings,
      icon: Eye,
      title: "Analytics & Insights",
      description: "Share anonymized data for platform analytics and insights",
      enabled: privacySettings.analytics
    },
    {
      id: 'personalization' as keyof typeof privacySettings,
      icon: Lock,
      title: "Personalization",
      description: "Use your data to personalize content and recommendations",
      enabled: privacySettings.personalization
    },
    {
      id: 'thirdPartySharing' as keyof typeof privacySettings,
      icon: Shield,
      title: "Third-party Sharing",
      description: "Allow sharing data with trusted partners for enhanced services",
      enabled: privacySettings.thirdPartySharing
    },
    {
      id: 'cookiePreferences' as keyof typeof privacySettings,
      icon: Cookie,
      title: "Cookie Preferences",
      description: "Accept cookies for improved functionality and user experience",
      enabled: privacySettings.cookiePreferences
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <Button onClick={() => setLocation('/profile-settings')} variant="ghost" size="sm">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-inter font-bold text-xl text-[#2D3A8C] dark:text-white">Privacy Settings</h1>
        </div>
      </div>

      <main className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Privacy Overview */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#2D3A8C] dark:text-blue-400" />
              <h2 className="font-inter font-bold text-xl text-gray-900 dark:text-white">Your Privacy Matters</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
              Control how your data is collected and used. These settings help protect your privacy while using InfoShield.
            </p>
          </CardHeader>
        </Card>

        {/* Privacy Controls */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-inter font-bold text-lg text-gray-900 dark:text-white mb-6">Privacy Controls</h3>
            
            <div className="space-y-6">
              {privacyOptions.map((option) => (
                <div key={option.id} className="flex items-start justify-between gap-4 p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-[#2D3A8C]/10 dark:bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <option.icon className="w-5 h-5 text-[#2D3A8C] dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">{option.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{option.description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={option.enabled}
                    onCheckedChange={() => handleToggle(option.id)}
                    className="flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Rights */}
        <Card className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="font-inter font-bold text-lg text-gray-900 dark:text-white mb-4">Your Data Rights</h3>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-lg py-3 h-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">Download My Data</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-lg py-3 h-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">Delete My Account</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-lg py-3 h-auto border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">Contact Privacy Officer</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};