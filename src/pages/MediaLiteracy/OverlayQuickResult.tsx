import { X, AlertTriangle, CheckCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OverlayQuickResultProps {
  type: "incident" | "success";
  isVisible: boolean;
  onClose: () => void;
  onViewMore: () => void;
}

export const OverlayQuickResult = ({ type, isVisible, onClose, onViewMore }: OverlayQuickResultProps): JSX.Element => {
  return <></>;
};