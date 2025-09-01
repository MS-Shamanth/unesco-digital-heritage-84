import { ArrowLeft, TreePine, Star, Target, Flame, Sprout, GraduationCap, Sun, Trophy, Calendar, Home, Gamepad2, MessageSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { getTreeStage, getCorrectAnswersFromStorage } from "@/utils/treeUtils";
export const MyTreeView = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [correctAnswers, setCorrectAnswers] = useState(0);

  useEffect(() => {
    // Load correct answers from localStorage using shared utility
    setCorrectAnswers(getCorrectAnswersFromStorage());
  }, []);
  const treeStage = getTreeStage(correctAnswers);
  return <div className="min-h-screen bg-gradient-to-b from-[#2D3A8C] to-[#4A5BB8]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-inter font-bold text-xl">My Knowledge Tree</h1>
        <div className="w-10"></div>
      </div>

      {/* Tree Animation */}
      <div className="flex justify-center mb-8 mt-8">
        <div className="relative">
          <div className="text-8xl animate-pulse" style={{
          filter: 'drop-shadow(0 0 15px rgba(46, 204, 113, 0.5))',
          animation: 'pulse 2s infinite, grow 0.3s ease-in-out'
        }}>
            {treeStage.icon}
          </div>
          {correctAnswers >= 7 && <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
              ⭐
            </div>}
        </div>
      </div>

      {/* Growth Status */}
      <div className="text-center mb-8 text-white px-6">
        <h2 className="font-inter font-bold text-2xl mb-2" style={{
        color: treeStage.color
      }}>
          {treeStage.text}
        </h2>
        
      </div>

      {/* Level and Points */}
      <div className="flex justify-between px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-white flex-1 mr-3">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-[#2ECC71]" />
            <span className="font-bold text-lg">Level 3</span>
          </div>
          <div className="text-sm opacity-80">Current Level</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 text-white flex-1 ml-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
            <span className="font-bold text-lg">1,250</span>
          </div>
          <div className="text-sm opacity-80">Total Points</div>
        </div>
      </div>

      {/* Progress to Next Level */}
      <div className="px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold">Progress to Level 4</span>
            <span className="text-sm">250/500</span>
          </div>
          <Progress value={50} className="h-3 bg-white/20" />
          <div className="text-sm opacity-80 mt-2">250 points to next level</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-6 mb-8">
        <h3 className="text-white font-inter font-bold text-xl mb-4">Achievements</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* First Truth */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-[#E74C3C]" />
            <div className="font-semibold text-sm mb-1">First Truth</div>
            <div className="text-xs opacity-80">Correctly identified your first fact</div>
          </div>

          {/* Hot Streak */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-[#FF6B35]" />
            <div className="font-semibold text-sm mb-1">Hot Streak</div>
            <div className="text-xs opacity-80">5 correct answers in a row</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Seed Planted */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center">
            <Sprout className="w-8 h-8 mx-auto mb-2 text-[#2ECC71]" />
            <div className="font-semibold text-sm mb-1">Seed Planted</div>
            <div className="text-xs opacity-80">Completed 10 fact checks</div>
          </div>

          {/* Scholar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center">
            <GraduationCap className="w-8 h-8 mx-auto mb-2 text-[#8E44AD]" />
            <div className="font-semibold text-sm mb-1">Scholar</div>
            <div className="text-xs opacity-80">Reach 1000 points</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expert */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center opacity-50">
            <Sun className="w-8 h-8 mx-auto mb-2 text-[#F39C12]" />
            <div className="font-semibold text-sm mb-1">Expert</div>
            <div className="text-xs opacity-80">Reach 2000 points</div>
          </div>

          {/* Master */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white text-center opacity-50">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-[#FFD700]" />
            <div className="font-semibold text-sm mb-1">Master</div>
            <div className="text-xs opacity-80">Reach 5000 points</div>
          </div>
        </div>
      </div>

      {/* Keep Growing Section */}
      <div className="px-6 mb-8">
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-2xl p-6 text-white text-center">
          <Calendar className="w-8 h-8 mx-auto mb-3" />
          <div className="font-inter font-bold text-lg mb-2">Keep Growing!</div>
          <div className="text-sm leading-relaxed">
            Every fact you verify and every truth you uncover helps your knowledge tree grow stronger. Continue your journey to media literacy mastery!
          </div>
        </div>
      </div>

      {/* Bottom Navigation Space */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-around">
          <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100">
            <Home className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Home</span>
          </Button>

          <Button onClick={() => setLocation('/game')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100">
            <Gamepad2 className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Game</span>
          </Button>

          <Button onClick={() => setLocation('/tree')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] bg-blue-50">
            <TreePine className="w-5 h-5 text-[#2D3A8C]" />
            <span className="text-xs font-inter text-[#2D3A8C]">Tree</span>
          </Button>

          <Button onClick={() => setLocation('/discussion')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Discussion</span>
          </Button>

          <Button onClick={() => setLocation('/saved')} variant="ghost" size="sm" className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100">
            <Save className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Saved</span>
          </Button>
        </div>
      </div>
    </div>;
};