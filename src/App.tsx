import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./context/ThemeContext";
import NotFound from "@/pages/not-found";

// Media Literacy Components
import { LoginPermissions } from "@/pages/MediaLiteracy/LoginPermissions";
import { SignUpPage } from "@/pages/MediaLiteracy/SignUpPage";
import { SignInPage } from "@/pages/MediaLiteracy/SignInPage";
import { MainDashboard } from "@/pages/MediaLiteracy/MainDashboard";
import { OverlayWithDashboard } from "@/pages/MediaLiteracy/OverlayWithDashboard";
import { GameSection } from "@/pages/MediaLiteracy/GameSection";
import { MyTreeView } from "@/pages/MediaLiteracy/MyTreeView";
import { SavedCollection } from "@/pages/MediaLiteracy/SavedCollection";
import { ExtendedView } from "@/pages/MediaLiteracy/ExtendedView";
import { ProfileSection } from "./pages/MediaLiteracy/ProfileSection";
import { DiscussionForum } from "./pages/MediaLiteracy/DiscussionForum";
import { ProfileSettings } from "./pages/MediaLiteracy/ProfileSettings";
import { NotificationPage } from "./pages/MediaLiteracy/NotificationPage";
import { SocialLogin } from "./pages/MediaLiteracy/SocialLogin";
import { PrivacySettings } from "./pages/MediaLiteracy/PrivacySettings";
import { HelpSupport } from "./pages/MediaLiteracy/HelpSupport";

function Router() {
  return (
    <Switch>
      {/* UNESCO Media Literacy App Flow */}
      <Route path="/" component={LoginPermissions} />
      <Route path="/signup" component={SignUpPage} />
      <Route path="/signin" component={SignInPage} />
      <Route path="/overlay" component={OverlayWithDashboard} />
      <Route path="/dashboard" component={MainDashboard} />
      <Route path="/game" component={GameSection} />
      <Route path="/tree" component={MyTreeView} />
      <Route path="/saved" component={SavedCollection} />
      <Route path="/extended" component={ExtendedView} />
      <Route path="/profile" component={ProfileSection} />
      <Route path="/discussion" component={DiscussionForum} />
      <Route path="/profile-settings" component={ProfileSettings} />
      <Route path="/notifications" component={NotificationPage} />
      <Route path="/social-login" component={SocialLogin} />
      <Route path="/privacy-settings" component={PrivacySettings} />
      <Route path="/help-support" component={HelpSupport} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;