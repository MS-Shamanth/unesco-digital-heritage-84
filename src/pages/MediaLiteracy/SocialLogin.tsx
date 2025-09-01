import { Facebook, Twitter, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SocialLogin = (): JSX.Element => {
  const socialOptions = [
    {
      icon: Facebook,
      label: "Continue with Facebook",
      color: "#1877F2",
      onClick: () => {
        // Mock Facebook login
        alert("Facebook login would be implemented here");
        window.location.href = '/dashboard';
      }
    },
    {
      icon: Twitter,
      label: "Continue with X (Twitter)",
      color: "#000000",
      onClick: () => {
        // Mock X/Twitter login
        alert("X (Twitter) login would be implemented here");
        window.location.href = '/dashboard';
      }
    },
    {
      icon: MapPin,
      label: "Continue with GOV.UK",
      color: "#0B0C0C",
      onClick: () => {
        // Mock GOV.UK login
        alert("GOV.UK login would be implemented here");
        window.location.href = '/dashboard';
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D3A8C] to-[#004E98] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-[20px] overflow-hidden">
        <CardHeader className="text-center py-8">
          <Button 
            onClick={() => window.history.back()}
            variant="ghost" 
            size="sm"
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <h1 className="font-inter font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Choose Social Login
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-300 text-sm">
            Connect with your preferred social platform
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <div className="space-y-4">
            {socialOptions.map((option, index) => (
              <Button 
                key={index} 
                onClick={option.onClick}
                className="w-full h-14 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 font-inter font-medium rounded-[16px] flex items-center justify-center gap-3"
              >
                <option.icon 
                  className="w-5 h-5" 
                  style={{ color: option.color }} 
                />
                {option.label}
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 font-inter leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};