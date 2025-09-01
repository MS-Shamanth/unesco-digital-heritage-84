import { Camera, Mic, Image, Shield, Chrome, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { useLocation } from "wouter";
export const LoginPermissions = (): JSX.Element => {
  const [showPermissions, setShowPermissions] = useState(false);
  const [, setLocation] = useLocation();
  const loginOptions = [{
    icon: Chrome,
    label: "Continue with Google",
    color: "#DB4437"
  }, {
    icon: Mail,
    label: "Continue with Email",
    color: "#2D3A8C"
  }, {
    icon: Users,
    label: "Continue with Social",
    color: "#004E98"
  }];
  const permissions = [{
    icon: Camera,
    title: "Camera Access",
    description: "Capture photos for real-time fact checking and media analysis"
  }, {
    icon: Mic,
    title: "Microphone Access",
    description: "Record audio for voice-based media literacy assessments"
  }, {
    icon: Image,
    title: "Photo Gallery",
    description: "Access your photos to verify and analyze existing media files"
  }];
  return <div className="min-h-screen bg-gradient-to-br from-[#2D3A8C] to-[#004E98] flex items-center justify-center p-4">
      {!showPermissions ? (/* Login Screen */
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-[20px] overflow-hidden">
          <CardHeader className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-inter font-bold text-2xl text-gray-900 mb-2">InfoShield</h1>
            <p className="font-inter text-gray-600 text-sm">
              Empowering critical thinking in the digital age
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-4">
              {loginOptions.map((option, index) => <Button key={index} onClick={() => {
                if (option.label === "Continue with Email") {
                  setLocation('/signup');
                } else if (option.label === "Continue with Social") {
                  window.open('/social-login', '_blank');
                } else {
                  setShowPermissions(true);
                }
              }} className="w-full h-14 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 font-inter font-medium rounded-[16px] flex items-center justify-center gap-3">
                  <option.icon className="w-5 h-5" style={{
              color: option.color
            }} />
                  {option.label}
                </Button>)}
            </div>

            <p className="text-center text-xs text-gray-500 mt-6 font-inter leading-relaxed">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>) : (/* Permissions Screen */
    <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-[20px] overflow-hidden">
          <CardHeader className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#2D3A8C] to-[#004E98] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-inter font-bold text-xl text-gray-900 mb-2">
              App Permissions
            </h2>
            <p className="font-inter text-gray-600 text-sm">
              We need these permissions to provide the best experience
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-6 mb-8">
              {permissions.map((permission, index) => <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-[12px] flex items-center justify-center flex-shrink-0">
                    <permission.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-inter font-semibold text-gray-900 mb-1">
                      {permission.title}
                    </h3>
                    <p className="font-inter text-sm text-gray-600 leading-relaxed">
                      {permission.description}
                    </p>
                  </div>
                </div>)}
            </div>

            <Button onClick={() => setLocation('/overlay')} className="w-full h-14 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-inter font-bold rounded-[16px] text-lg">
              Continue
            </Button>

            <Button variant="ghost" className="w-full mt-3 text-gray-500 hover:text-gray-700 font-inter">
              Skip for now
            </Button>
          </CardContent>
        </Card>)}
    </div>;
};