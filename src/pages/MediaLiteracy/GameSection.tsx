import { ArrowLeft, RotateCcw, TreePine, Star, Home, Gamepad2, MessageSquare, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useSpring, animated, config } from "react-spring";
import { useDrag } from "react-use-gesture";
import { getTreeStage, getCorrectAnswersFromStorage, updateCorrectAnswers } from "@/utils/treeUtils";

// Quiz data with 10 questions
const quizData = [
  {
    id: 1,
    category: "Health Today",
    title: "Scientists Discover Cure for All Cancers",
    description: "This sensational claim lacks peer review and contradicts established medical research protocols.",
    isTrue: false
  },
  {
    id: 2,
    category: "Tech News",
    title: "New AI System Achieves Human-Level Intelligence",
    description: "Researchers at leading tech companies report breakthrough in artificial general intelligence.",
    isTrue: false
  },
  {
    id: 3,
    category: "Climate Science",
    title: "Ocean Temperatures Rise 0.6°C This Year",
    description: "Scientific data shows consistent warming patterns across major ocean basins worldwide.",
    isTrue: true
  },
  {
    id: 4,
    category: "Space Exploration", 
    title: "NASA Confirms Water on Mars Surface",
    description: "Multiple rover missions have detected liquid water in several locations on the Martian surface.",
    isTrue: true
  },
  {
    id: 5,
    category: "Medical Research",
    title: "Vitamin C Prevents All Viral Infections",
    description: "Study claims mega-doses of vitamin C provide complete immunity against all viruses.",
    isTrue: false
  },
  {
    id: 6,
    category: "Economics",
    title: "Global GDP Expected to Grow 3.2% This Year",
    description: "International Monetary Fund projects moderate economic growth based on current indicators.",
    isTrue: true
  },
  {
    id: 7,
    category: "Environment",
    title: "Miracle Plant Absorbs All Carbon Dioxide",
    description: "New species discovered that can single-handedly reverse climate change in just months.",
    isTrue: false
  },
  {
    id: 8,
    category: "Technology",
    title: "Quantum Computer Solves Complex Problems",
    description: "Latest quantum computing advances show promising results for specific mathematical applications.",
    isTrue: true
  },
  {
    id: 9,
    category: "Health",
    title: "Drinking 10 Glasses of Water Daily Extends Life by 20 Years",
    description: "Unverified study claims extreme hydration dramatically increases human lifespan.",
    isTrue: false
  },
  {
    id: 10,
    category: "Energy",
    title: "Solar Panel Efficiency Reaches 47% in Lab Tests",
    description: "Research facility achieves new record for photovoltaic energy conversion efficiency.",
    isTrue: true
  }
];

export const GameSection = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [points, setPoints] = useState(1350);
  const [streak, setStreak] = useState(9);
  const [progress, setProgress] = useState(65);
  const [dailyQuizzesCompleted, setDailyQuizzesCompleted] = useState(0);
  const [starredCards, setStarredCards] = useState<number[]>([]);
  const [showStarred, setShowStarred] = useState(false);
  const [leafScale, setLeafScale] = useState(1);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('gameData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPoints(data.points || 1350);
      setStreak(data.streak || 9);
      setProgress(data.progress || 65);
      setStarredCards(data.starredCards || []);
      setCorrectAnswers(data.correctAnswers || 0);
      
      // Reset daily quizzes if it's a new day
      const today = new Date().toDateString();
      if (data.lastPlayDate !== today) {
        setDailyQuizzesCompleted(0);
      } else {
        setDailyQuizzesCompleted(data.dailyQuizzesCompleted || 0);
      }
    }
  }, []);

  // Save data to localStorage
  const saveGameData = (newData: any) => {
    const gameData = {
      points: newData.points || points,
      streak: newData.streak || streak,
      progress: newData.progress || progress,
      starredCards: newData.starredCards || starredCards,
      correctAnswers: newData.correctAnswers !== undefined ? newData.correctAnswers : correctAnswers,
      dailyQuizzesCompleted: newData.dailyQuizzesCompleted || dailyQuizzesCompleted,
      lastPlayDate: new Date().toDateString()
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
  };

  // Card animation
  const [{ x, rot, scale }, api] = useSpring(() => ({
    x: 0,
    rot: 0,
    scale: 1,
    config: config.wobbly,
  }));

  // Leaf animation
  const leafAnimation = useSpring({
    transform: `scale(${leafScale})`,
    config: config.gentle,
  });

  // Drag gesture
  const bind = useDrag(({ active, movement, direction, velocity, down }) => {
    const mx = movement?.[0] || 0;
    const xDir = direction?.[0] || 0;
    const vx = velocity?.[0] || 0;
    
    const trigger = Math.abs(mx) > 150 || (vx > 0.5 && Math.abs(mx) > 50);
    const dir = xDir < 0 ? -1 : 1;
    
    if (!active && trigger) {
      // Animate card completely off screen in the direction swiped
      const targetX = dir > 0 ? window.innerWidth + 100 : -(window.innerWidth + 100);
      api({
        x: targetX,
        rot: dir * 30,
        scale: 0.8,
        config: { tension: 300, friction: 30 }
      });
      handleSwipe(dir > 0);
    } else if (!active) {
      // Return to center if not enough swipe
      api({
        x: 0,
        rot: 0,
        scale: 1,
        config: { tension: 300, friction: 30 }
      });
    } else {
      // While dragging
      const rotation = mx / 100;
      const scaleValue = active ? 1.05 : 1;
      api({
        x: mx,
        rot: rotation,
        scale: scaleValue,
        config: { tension: 300, friction: 30 }
      });
    }
  });

  const handleSwipe = (isRight: boolean) => {
    if (dailyQuizzesCompleted >= 10) return;
    
    const currentQuestion = quizData[currentQuiz];
    const isCorrect = (isRight && currentQuestion.isTrue) || (!isRight && !currentQuestion.isTrue);
    
    // Show immediate feedback
    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      const newPoints = points + 100;
      const newStreak = streak + 1;
      const newProgress = Math.min(100, progress + 5);
      const newCorrectAnswers = correctAnswers + 1;
      
      setPoints(newPoints);
      setStreak(newStreak);
      setProgress(newProgress);
      setCorrectAnswers(newCorrectAnswers);
      
      // Animate leaf growth
      setLeafScale(prev => prev + 0.1);
      setTimeout(() => setLeafScale(prev => Math.max(1, prev - 0.05)), 500);
    } else {
      setStreak(0);
    }
    
    // Wait for card animation to complete, then reset
    setTimeout(() => {
      // Move to next question immediately
      if (currentQuiz < quizData.length - 1) {
        setCurrentQuiz(prev => prev + 1);
      } else {
        setCurrentQuiz(0); // Reset to first question
      }
      
      const newDailyQuizzes = dailyQuizzesCompleted + 1;
      setDailyQuizzesCompleted(newDailyQuizzes);
      
      saveGameData({
        points: isCorrect ? points + 100 : points,
        streak: isCorrect ? streak + 1 : 0,
        progress: isCorrect ? Math.min(100, progress + 5) : progress,
        correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers,
        dailyQuizzesCompleted: newDailyQuizzes
      });
      
      // Reset card position for next question after a brief delay
      setTimeout(() => {
        api({
          x: 0,
          rot: 0,
          scale: 1,
          immediate: true, // Snap to position instantly
        });
        setShowFeedback(null);
      }, 100);
    }, 600); // Reduced timing for better UX
  };

  const toggleStar = (cardId: number) => {
    const newStarredCards = starredCards.includes(cardId)
      ? starredCards.filter(id => id !== cardId)
      : [...starredCards, cardId];
    
    setStarredCards(newStarredCards);
    saveGameData({ starredCards: newStarredCards });
  };

  const currentQuestion = quizData[currentQuiz];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D3A8C] to-[#4A5BB8]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <Button onClick={() => setLocation('/dashboard')} variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-inter font-bold text-xl">Truth or False</h1>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      {/* Points and Streak */}
      <div className="flex justify-between px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
            <span className="font-bold text-lg">{points.toLocaleString()}</span>
          </div>
          <div className="text-sm opacity-80">Points</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#2ECC71] rounded-full"></div>
            <span className="font-bold text-lg">{streak}</span>
          </div>
          <div className="text-sm opacity-80">Streak</div>
        </div>
      </div>

      {/* Tree Animation - Synchronized with MyTreeView */}
      <div className="flex justify-center mb-8">
        <animated.div style={leafAnimation} className="relative">
          <div className="text-8xl animate-pulse" style={{
            filter: 'drop-shadow(0 0 15px rgba(46, 204, 113, 0.5))',
            animation: 'pulse 2s infinite, grow 0.3s ease-in-out'
          }}>
            {getTreeStage(correctAnswers).icon}
          </div>
          {correctAnswers >= 7 && <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
              ⭐
            </div>}
        </animated.div>
      </div>

      {/* Progress Section */}
      <div className="px-6 mb-8 text-center text-white">
        <h2 className="font-inter font-bold text-xl mb-4" style={{ color: getTreeStage(correctAnswers).color }}>
          {getTreeStage(correctAnswers).text}
        </h2>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Daily Limit Warning */}
      {dailyQuizzesCompleted >= 10 && (
        <div className="px-6 mb-4">
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 text-white text-center">
            <h3 className="font-bold mb-2">Daily Limit Reached!</h3>
            <p className="text-sm">Come back tomorrow for more quizzes</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="flex justify-between px-6 mb-6 text-white text-sm">
        <div className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Swipe Left = False</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Swipe Right = True</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </div>
      </div>

      {/* Quiz Counter */}
      <div className="text-center mb-4 text-white">
        <span className="text-sm opacity-80">Quiz {Math.min(dailyQuizzesCompleted + 1, 10)} of 10</span>
      </div>

      {/* Content Card with Swipe Gesture */}
      <div className="px-6 mb-20 relative min-h-[400px]">
        {dailyQuizzesCompleted < 10 && (
          <animated.div
            {...bind()}
            style={{
              x,
              rotate: rot.to(r => `${r}deg`),
              scale,
            }}
            className="cursor-grab active:cursor-grabbing touch-none w-full h-full"
          >
            <Card className="bg-white rounded-3xl shadow-lg relative w-full max-w-sm mx-auto">
              <CardContent className="p-0">
                {/* Star Button */}
                <Button
                  onClick={() => toggleStar(currentQuestion.id)}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white"
                >
                  <Star 
                    className={`w-5 h-5 ${
                      starredCards.includes(currentQuestion.id)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                </Button>

                {/* Image Section */}
                <div className="bg-gray-100 rounded-t-3xl h-48 flex items-center justify-center">
                  <div className="w-20 h-20 text-[#4A90A4]">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c-1.27 0-2.4.8-2.82 2H3v2h1.95L5 16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2l.05-9H21V5h-6.18C14.4 3.8 13.27 3 12 3zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 4h4v2h-4V9z"/>
                      <circle cx="8" cy="12" r="1"/>
                      <circle cx="16" cy="12" r="1"/>
                      <path d="M12 16c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="inline-block bg-blue-100 text-[#2D3A8C] px-3 py-1 rounded-full text-sm mb-3">
                    {currentQuestion.category}
                  </div>
                  <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">
                    {currentQuestion.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {currentQuestion.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </animated.div>
        )}

        {/* Feedback Animation */}
        {showFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className={`text-8xl font-bold animate-pulse ${
              showFeedback === 'correct' 
                ? 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' 
                : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
            }`}>
              {showFeedback === 'correct' ? '✓' : '✗'}
            </div>
          </div>
        )}

        {/* Background Color Overlay for Feedback */}
        {showFeedback && (
          <div className={`absolute inset-0 z-10 pointer-events-none rounded-3xl transition-all duration-300 ${
            showFeedback === 'correct' 
              ? 'bg-green-500/20 border-2 border-green-500/50' 
              : 'bg-red-500/20 border-2 border-red-500/50'
          }`} />
        )}

        {/* Daily Limit Reached Card */}
        {dailyQuizzesCompleted >= 10 && (
          <Card className="bg-white rounded-3xl shadow-lg">
            <CardContent className="p-8 text-center">
              <TreePine className="w-16 h-16 mx-auto mb-4 text-[#2ECC71]" />
              <h3 className="font-inter font-bold text-xl text-gray-900 mb-3">
                Great Job Today!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                You've completed all 10 daily quizzes. Your knowledge tree is growing strong!
              </p>
              <Button
                onClick={() => setLocation('/tree')}
                className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
              >
                View Your Tree
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Starred Cards Button */}
      {starredCards.length > 0 && (
        <div className="px-6 mb-6">
          <Button
            onClick={() => setShowStarred(!showStarred)}
            variant="outline"
            className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <Star className="w-4 h-4 mr-2" />
            View Starred Cards ({starredCards.length})
          </Button>
        </div>
      )}

      {/* Starred Cards Section */}
      {showStarred && starredCards.length > 0 && (
        <div className="px-6 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Your Starred Cards
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {starredCards.map(cardId => {
                const card = quizData.find(q => q.id === cardId);
                if (!card) return null;
                return (
                  <div key={cardId} className="bg-white/20 rounded-xl p-3">
                    <div className="text-xs text-white/80 mb-1">{card.category}</div>
                    <div className="text-white font-semibold text-sm mb-1">{card.title}</div>
                    <div className="text-white/70 text-xs">{card.description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] bg-blue-50"
          >
            <Gamepad2 className="w-5 h-5 text-[#2D3A8C]" />
            <span className="text-xs font-inter text-[#2D3A8C]">Game</span>
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
            className="flex flex-col items-center gap-1 p-2 rounded-[12px] hover:bg-gray-100"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-inter text-gray-600">Discussion</span>
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
    </div>
  );
};