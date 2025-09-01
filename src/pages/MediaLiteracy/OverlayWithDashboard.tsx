import { MainDashboard } from "./MainDashboard";
import { OverlayQuickResult } from "./OverlayQuickResult";
import { useLocation } from "wouter";

export const OverlayWithDashboard = (): JSX.Element => {
  const [, setLocation] = useLocation();

  return (
    <div className="relative">
      <MainDashboard />
      <OverlayQuickResult
        type="incident"
        isVisible={true}
        onClose={() => setLocation('/dashboard')}
        onViewMore={() => setLocation('/extended')}
      />
    </div>
  );
};