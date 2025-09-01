import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";

export const SignInPage = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle actual signin logic here
    setLocation('/overlay');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D3A8C] to-[#004E98] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl rounded-[20px] overflow-hidden">
        <CardHeader className="text-center py-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="absolute left-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-[#2D3A8C] to-[#004E98] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-inter font-bold text-2xl text-gray-900 mb-2">Welcome Back</h1>
          <p className="font-inter text-gray-600 text-sm">
            Sign in to your InfoShield account
          </p>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-inter font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="h-12 rounded-[12px] border-gray-200 font-inter"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-inter font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="h-12 rounded-[12px] border-gray-200 font-inter pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-transparent"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="link"
                className="font-inter text-sm text-[#2D3A8C] p-0 h-auto"
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] hover:from-[#27AE60] hover:to-[#2ECC71] text-white font-inter font-bold rounded-[16px] text-lg mt-6"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="font-inter text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                onClick={() => setLocation('/signup')}
                className="font-inter font-semibold text-[#2D3A8C] p-0 h-auto"
              >
                Sign Up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};