import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question } from './Question';
import { Summary } from './Summary';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Flame, ArrowRight, Lightbulb } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import mascotReady from 'figma:asset/323188f0e3e79b7c7e3cd8b7abc137b2fbc3e0bf.png';
import mascotBusiness from 'figma:asset/a89b18b5e3d5c51aa98c28c79f1a0609389ba3fe.png';
import mascotWarrior from 'figma:asset/dc6dfecf37e308ac34c4914bfc22a0f0d35c83b2.png';
import mascotCalligraphy from 'figma:asset/3948fd1e5afb8570eaa4bc3c08d06fb999d80804.png';
import studyingCharacter from 'figma:asset/aad1ae654d4d713251b4aba193d008917754d86b.png';
import jwLogo from 'figma:asset/7e23a3beff6be864e690ff3a3c80990169a1b4e6.png';
import konnichiWowLogo from 'figma:asset/c9578905348ade8f990cebe7459a2ce8909a2053.png';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizData {
  quizTitle: string;
  questions: QuizQuestion[];
}

interface Answer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

const QUIZ_DATA: QuizData = {
  "quizTitle": "KonnichiWow Japanese Language Practice Quiz",
  "questions": [
    {
      "id": 1,
      "question": "What does 'こんにちは' (Konnichiwa) mean?",
      "options": [
        "Good morning",
        "Hello/Good afternoon",
        "Good night",
        "Goodbye"
      ],
      "correctAnswer": 1,
      "explanation": "'こんにちは' (Konnichiwa) is a common Japanese greeting used during the daytime, meaning 'Hello' or 'Good afternoon'."
    },
    {
      "id": 2,
      "question": "Which hiragana character represents the sound 'ka'?",
      "options": [
        "き",
        "か",
        "く",
        "け"
      ],
      "correctAnswer": 1,
      "explanation": "The hiragana character 'か' represents the sound 'ka'. き=ki, く=ku, け=ke."
    },
    {
      "id": 3,
      "question": "How do you say 'Thank you' in Japanese?",
      "options": [
        "Sumimasen",
        "Gomenasai",
        "Arigatou",
        "Sayonara"
      ],
      "correctAnswer": 2,
      "explanation": "'ありがとう' (Arigatou) means 'Thank you' in Japanese. Sumimasen=Excuse me, Gomenasai=I'm sorry, Sayonara=Goodbye."
    },
    {
      "id": 4,
      "question": "What is the Japanese word for 'cat'?",
      "options": [
        "Inu",
        "Tori",
        "Neko",
        "Sakana"
      ],
      "correctAnswer": 2,
      "explanation": "'ねこ' (Neko) means 'cat'. Inu=dog, Tori=bird, Sakana=fish."
    },
    {
      "id": 5,
      "question": "Which number does 'san' (三) represent?",
      "options": [
        "One",
        "Two",
        "Three",
        "Four"
      ],
      "correctAnswer": 2,
      "explanation": "'三' (San) is the Japanese number three. 一=ichi (one), 二=ni (two), 四=shi/yon (four)."
    }
  ]
};

export function Quiz() {
  const [quizData] = useState<QuizData>(QUIZ_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showBadgeAward, setShowBadgeAward] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const badgeButtonRef = useRef<HTMLButtonElement>(null);
  const quizContainerRef = useRef<HTMLDivElement>(null);

  // Get mascot image and message based on quiz state (Story progression)
  const getMascotData = () => {
    // Badge award screen
    if (showBadgeAward) {
      return {
        image: mascotReady,
        message: "🎉 やった！\nBadge Unlocked!",
        mood: "excited"
      };
    }
    
    // Summary screen - Show achievement based on score percentage
    if (showSummary) {
      const percentage = (score / quizData.questions.length) * 100;
      if (percentage === 100) {
        return {
          image: mascotCalligraphy,
          message: "完璧！\nPerfect Score!",
          mood: "master"
        };
      } else if (percentage >= 80) {
        return {
          image: mascotWarrior,
          message: "素晴らしい！\nGreat Job!",
          mood: "proud"
        };
      } else if (percentage >= 60) {
        return {
          image: mascotBusiness,
          message: "頑張った！\nGood Effort!",
          mood: "encouraging"
        };
      } else {
        return {
          image: mascotReady,
          message: "次は頑張ろう！\nLet's try again!",
          mood: "supportive"
        };
      }
    }
    
    // During quiz - Story progression through stages
    // Stage 1: Beginning (Q1) - Ready to start
    if (currentQuestionIndex === 0) {
      if (!showFeedback) {
        return {
          image: mascotReady,
          message: "始めよう！\nLet's start!",
          mood: "ready"
        };
      } else {
        return {
          image: mascotReady,
          message: selectedAnswer === quizData.questions[0].correctAnswer 
            ? "いいね！\nNice!" 
            : "大丈夫！\nIt's okay!",
          mood: "encouraging"
        };
      }
    }
    
    // Stage 2: Learning Phase (Q2-3) - Business mascot studying
    if (currentQuestionIndex <= 2) {
      if (!showFeedback) {
        return {
          image: mascotBusiness,
          message: currentStreak >= 2 
            ? "調子いいね！\nYou're on fire!" 
            : "集中して！\nFocus!",
          mood: "studying"
        };
      } else {
        return {
          image: mascotBusiness,
          message: selectedAnswer === quizData.questions[currentQuestionIndex].correctAnswer
            ? "正解！\nCorrect!"
            : "復習しよう！\nLet's review!",
          mood: "teaching"
        };
      }
    }
    
    // Stage 3: Challenge Phase (Q4-5) - Warrior mascot pushing through
    if (currentQuestionIndex <= 4) {
      if (!showFeedback) {
        return {
          image: mascotWarrior,
          message: currentStreak >= 3
            ? `${currentStreak}連続！\n${currentStreak} streak!`
            : "挑戦！\nChallenge!",
          mood: "determined"
        };
      } else {
        return {
          image: mascotWarrior,
          message: selectedAnswer === quizData.questions[currentQuestionIndex].correctAnswer
            ? "勝利！\nVictory!"
            : "諦めないで！\nDon't give up!",
          mood: "warrior"
        };
      }
    }
    
    // Stage 4: Mastery Phase (Final question) - Calligraphy mascot achieving mastery
    if (!showFeedback) {
      return {
        image: mascotCalligraphy,
        message: "もう少し！\nAlmost there!",
        mood: "focused"
      };
    } else {
      return {
        image: mascotCalligraphy,
        message: selectedAnswer === quizData.questions[currentQuestionIndex].correctAnswer
          ? "素晴らしい！\nExcellent!"
          : "良い挑戦！\nGood try!",
        mood: "master"
      };
    }
  };

  const handleSelectAnswer = useCallback((index: number) => {
    if (showFeedback) return;

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const isCorrect = index === currentQuestion.correctAnswer;

    setSelectedAnswer(index);
    setShowFeedback(true);

    // Update score and streak
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setCurrentStreak(0);
    }

    // Save answer
    setAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer: index,
        isCorrect,
      },
    ]);
  }, [showFeedback, currentQuestionIndex, quizData.questions]);

  // Focus container on mount to enable keyboard navigation immediately
  useEffect(() => {
    quizContainerRef.current?.focus();
  }, []);

  // Refocus container when returning from badge/summary screens
  useEffect(() => {
    if (!showFeedback && !showSummary && !showBadgeAward) {
      quizContainerRef.current?.focus();
    }
  }, [showFeedback, showSummary, showBadgeAward]);

  // Keyboard navigation for options
  useEffect(() => {
    if (showFeedback || showSummary || showBadgeAward) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const optionCount = currentQuestion.options.length;

      // Number keys 1-4 to highlight option only (not select)
      if (e.key >= '1' && e.key <= String(optionCount)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        setHighlightedOption(index);
        return;
      }
      
      // Arrow keys to navigate
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedOption(prev => {
          if (prev === null) return 0;
          const newIndex = e.key === 'ArrowDown' 
            ? Math.min(prev + 1, optionCount - 1)
            : Math.max(prev - 1, 0);
          return newIndex;
        });
      }
      
      // Enter key to confirm selection
      if (e.key === 'Enter' && highlightedOption !== null) {
        e.preventDefault();
        handleSelectAnswer(highlightedOption);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, showSummary, showBadgeAward, currentQuestionIndex, highlightedOption, quizData.questions, handleSelectAnswer]);

  // Keyboard navigation for Next button
  useEffect(() => {
    if (!showFeedback || showSummary || showBadgeAward) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nextButtonRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFeedback, showSummary, showBadgeAward]);

  // Keyboard navigation for Badge Award screen
  useEffect(() => {
    if (!showBadgeAward) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        badgeButtonRef.current?.click();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showBadgeAward]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setHighlightedOption(null);
      setShowFeedback(false);
      // Refocus container to ensure keyboard navigation works
      setTimeout(() => quizContainerRef.current?.focus(), 0);
    } else {
      // Show badge award after last question
      setShowBadgeAward(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setHighlightedOption(null);
    setShowFeedback(false);
    setAnswers([]);
    setScore(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setShowBadgeAward(false);
    setShowSummary(false);
    // Refocus container to ensure keyboard navigation works
    setTimeout(() => quizContainerRef.current?.focus(), 0);
  };

  const bgClass = isDarkMode 
    ? 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-colors duration-500 relative overflow-hidden' 
    : 'min-h-screen bg-gradient-to-br from-pink-50 via-white to-cyan-50 transition-colors duration-500 relative overflow-hidden';

  if (showSummary) {
    return (
      <div className={bgClass}>
        {/* Japanese Pattern Background */}
        <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'opacity-10' : ''}`} style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${isDarkMode ? '#26ECB4' : '#EC265F'} 35px, ${isDarkMode ? '#26ECB4' : '#EC265F'} 70px)`
        }} />
        
        {/* Floating Cherry Blossoms */}
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">🌸</div>
        <div className="absolute top-32 right-20 text-3xl animate-float-delay opacity-20">🌸</div>
        <div className="absolute bottom-20 left-32 text-5xl animate-float opacity-20">🌸</div>
        <div className="absolute top-64 right-40 text-2xl animate-float-delay opacity-20">🌸</div>
        
        {/* Fixed Mascot - Bottom Right with Story Elements (Summary Page) */}
        <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            {/* Decorative Japanese elements around mascot */}
            <div className="absolute -top-8 -left-8 text-2xl animate-pulse opacity-30">🌸</div>
            <div className="absolute -top-6 -right-6 text-xl animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
            
            {/* Speech bubble with contextual message */}
            <div className={`absolute bottom-full right-0 mb-4 px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-slate-800/95 border-[#26ECB4]/40' : 'bg-white/95 border-[#EC265F]/40'} border-2 backdrop-blur-sm shadow-xl whitespace-pre-line text-center min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-500`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {getMascotData().message}
              </div>
              {/* Speech bubble tail */}
              <div className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${isDarkMode ? 'bg-slate-800 border-r-2 border-b-2 border-[#26ECB4]/40' : 'bg-white border-r-2 border-b-2 border-[#EC265F]/40'}`} />
            </div>
            
            {/* Decorative background with brand colors */}
            <div className={`absolute inset-0 -m-6 rounded-full bg-gradient-to-br ${isDarkMode ? 'from-[#26ECB4]/20 via-purple-500/10 to-[#EC265F]/20' : 'from-[#EC265F]/10 via-pink-100 to-[#26ECB4]/10'} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
            
            {/* Mascot image */}
            <img 
              src={getMascotData().image} 
              alt="KonnichiWow Mascot" 
              className="w-36 h-auto relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" 
            />
            
            {/* Corner decorations */}
            <div className={`absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#EC265F] to-[#26ECB4] animate-pulse`} />
            <div className={`absolute -top-2 -left-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#26ECB4] to-[#EC265F] animate-pulse`} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        <div className="py-8 px-4 relative z-10">
          <div className="absolute top-6 right-6">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>
          <Summary
            questions={quizData.questions}
            answers={answers}
            score={score}
            maxStreak={maxStreak}
            onRestart={handleRestart}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    );
  }

  // Badge Award Screen
  if (showBadgeAward) {
    const totalQuestions = quizData.questions.length;
    let badgeType = 'bronze';
    let badgeEmoji = '🥉';
    let badgeTitle = 'ブロンズ Bronze Badge';
    let badgeMessage = 'Good start! Keep practicing!';
    
    if (score === totalQuestions) {
      badgeType = 'gold';
      badgeEmoji = '🥇';
      badgeTitle = 'ゴールド Gold Badge';
      badgeMessage = 'Perfect score! Outstanding work! 完璧！';
    } else if (score >= 3) {
      badgeType = 'silver';
      badgeEmoji = '🥈';
      badgeTitle = 'シルバー Silver Badge';
      badgeMessage = 'Great job! You\'re doing well!';
    }

    const handleViewResults = () => {
      setShowBadgeAward(false);
      setShowSummary(true);
    };

    return (
      <div className={bgClass}>
        {/* Japanese Pattern Background */}
        <div className={`absolute inset-0 opacity-5 ${isDarkMode ? 'opacity-10' : ''}`} style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, ${isDarkMode ? '#26ECB4' : '#EC265F'} 35px, ${isDarkMode ? '#26ECB4' : '#EC265F'} 70px)`
        }} />
        
        {/* Floating Cherry Blossoms */}
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-20">🌸</div>
        <div className="absolute top-32 right-20 text-3xl animate-float-delay opacity-20">🌸</div>
        <div className="absolute bottom-20 left-32 text-5xl animate-float opacity-20">🌸</div>
        <div className="absolute top-64 right-40 text-2xl animate-float-delay opacity-20">🌸</div>
        
        {/* Fixed Mascot - Bottom Right with Story Elements (Badge Award) */}
        <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative group">
            {/* Decorative Japanese elements around mascot */}
            <div className="absolute -top-8 -left-8 text-2xl animate-pulse opacity-30">🎉</div>
            <div className="absolute -top-6 -right-6 text-xl animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}>⭐</div>
            
            {/* Speech bubble with contextual message */}
            <div className={`absolute bottom-full right-0 mb-4 px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-slate-800/95 border-[#26ECB4]/40' : 'bg-white/95 border-[#EC265F]/40'} border-2 backdrop-blur-sm shadow-xl whitespace-pre-line text-center min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-500`}>
              <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {getMascotData().message}
              </div>
              {/* Speech bubble tail */}
              <div className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${isDarkMode ? 'bg-slate-800 border-r-2 border-b-2 border-[#26ECB4]/40' : 'bg-white border-r-2 border-b-2 border-[#EC265F]/40'}`} />
            </div>
            
            {/* Decorative background with brand colors */}
            <div className={`absolute inset-0 -m-6 rounded-full bg-gradient-to-br ${isDarkMode ? 'from-[#26ECB4]/20 via-purple-500/10 to-[#EC265F]/20' : 'from-[#EC265F]/10 via-pink-100 to-[#26ECB4]/10'} blur-2xl group-hover:blur-3xl transition-all duration-500`} />
            
            {/* Mascot image */}
            <img 
              src={getMascotData().image} 
              alt="KonnichiWow Mascot" 
              className="w-36 h-auto relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300" 
            />
            
            {/* Corner decorations */}
            <div className={`absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#EC265F] to-[#26ECB4] animate-pulse`} />
            <div className={`absolute -top-2 -left-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#26ECB4] to-[#EC265F] animate-pulse`} style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
        
        <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
          <div className="absolute top-6 right-6">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
          </div>

          <Card className={`max-w-2xl w-full p-12 ${isDarkMode ? 'bg-slate-800/90 border-[#26ECB4]/30' : 'bg-white/95 border-[#EC265F]/30'} backdrop-blur-lg shadow-2xl rounded-3xl border-4 text-center animate-in fade-in zoom-in duration-700`}>
            {/* Confetti effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-3xl">
              <div className="absolute top-0 left-1/4 text-4xl animate-float opacity-40">✨</div>
              <div className="absolute top-10 right-1/4 text-3xl animate-float-delay opacity-40">⭐</div>
              <div className="absolute top-5 left-1/3 text-2xl animate-float opacity-40">🎉</div>
              <div className="absolute top-8 right-1/3 text-3xl animate-float-delay opacity-40">🎊</div>
            </div>

            <div className="space-y-8">
              {/* Congratulations Header */}
              <div>
                <h2 className={`text-3xl mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  おめでとうございます！
                </h2>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Congratulations!
                </p>
              </div>

              {/* Badge Display */}
              <div className="relative">
                <div className={`mx-auto w-64 h-64 rounded-full flex items-center justify-center shadow-2xl ${
                  badgeType === 'gold' 
                    ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 shadow-yellow-500/50' 
                    : badgeType === 'silver'
                    ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-gray-500/50'
                    : 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 shadow-amber-700/50'
                } animate-in zoom-in spin-in duration-1000 border-8 border-white/50`}>
                  <div className="text-9xl drop-shadow-2xl">{badgeEmoji}</div>
                </div>
                
                {/* Rotating ring effect */}
                <div className={`absolute inset-0 mx-auto w-64 h-64 rounded-full border-4 border-dashed ${
                  badgeType === 'gold' ? 'border-yellow-400' : badgeType === 'silver' ? 'border-gray-400' : 'border-amber-600'
                } animate-spin`} style={{ animationDuration: '10s' }}></div>
              </div>

              {/* Badge Title */}
              <div>
                <h3 className={`text-4xl mb-2 bg-gradient-to-r ${
                  badgeType === 'gold' 
                    ? 'from-yellow-600 to-yellow-400' 
                    : badgeType === 'silver'
                    ? 'from-gray-600 to-gray-400'
                    : 'from-amber-700 to-amber-500'
                } bg-clip-text text-transparent`}>
                  {badgeTitle}
                </h3>
                <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {badgeMessage}
                </p>
              </div>

              {/* Score Display */}
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                <p className={`text-5xl mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {score} / {totalQuestions}
                </p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  正解数 Questions Correct
                </p>
              </div>

              {/* Continue Button */}
              <Button
                ref={badgeButtonRef}
                onClick={handleViewResults}
                className="bg-gradient-to-r from-[#EC265F] to-[#26ECB4] hover:from-[#EC265F]/90 hover:to-[#26ECB4]/90 px-12 py-7 shadow-2xl shadow-[#EC265F]/30 transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-white/20 w-full"
                size="lg"
              >
                詳細を見る View Detailed Results
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes float-delay {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-5deg); }
          }
        `}</style>
      </div>
    );
  }

  // Safety check to ensure valid question index
  const safeQuestionIndex = Math.min(Math.max(0, currentQuestionIndex), quizData.questions.length - 1);
  const currentQuestion = quizData.questions[safeQuestionIndex];
  // Progress based on number of answered questions, not current question
  const progress = (answers.length / quizData.questions.length) * 100;
  const isCorrect = selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div 
      ref={quizContainerRef}
      tabIndex={0}
      className={bgClass}
      style={{ outline: 'none' }}
    >
      {/* Japanese Wave Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,0 Q300,80 600,40 T1200,0 L1200,120 L0,120 Z" fill={isDarkMode ? '#26ECB4' : '#EC265F'} />
        </svg>
      </div>
      
      {/* Decorative Japanese Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float">🏯</div>
        <div className="absolute top-40 right-16 text-5xl opacity-10 animate-float-delay">🎌</div>
        <div className="absolute bottom-32 left-20 text-4xl opacity-10 animate-float">🌸</div>
        <div className="absolute top-60 right-32 text-3xl opacity-10 animate-float-delay">🎋</div>
        <div className="absolute bottom-48 right-12 text-5xl opacity-10 animate-float">⛩️</div>
      </div>

      {/* Fixed Mascot - Bottom Right with Story Elements (Quiz Questions) */}
      <div className="fixed bottom-8 right-8 z-50 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-700" key={`mascot-${currentQuestionIndex}-${showFeedback}`}>
        <div className="relative group">
          {/* Decorative Japanese elements around mascot - changes based on question */}
          <div className="absolute -top-8 -left-8 text-2xl animate-pulse opacity-30">
            {currentQuestionIndex === 0 ? '🌸' : currentQuestionIndex <= 2 ? '📚' : currentQuestionIndex <= 4 ? '⚔️' : '🎨'}
          </div>
          <div className="absolute -top-6 -right-6 text-xl animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}>
            {showFeedback && isCorrect ? '✨' : '💪'}
          </div>
          
          {/* Speech bubble with contextual message */}
          <div className={`absolute bottom-full right-0 mb-4 px-4 py-3 rounded-2xl ${isDarkMode ? 'bg-slate-800/95 border-[#26ECB4]/40' : 'bg-white/95 border-[#EC265F]/40'} border-2 backdrop-blur-sm shadow-xl whitespace-pre-line text-center min-w-[140px] animate-in fade-in slide-in-from-bottom-2 duration-500`}>
            <div className={`text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {getMascotData().message}
            </div>
            {/* Speech bubble tail */}
            <div className={`absolute -bottom-2 right-8 w-4 h-4 rotate-45 ${isDarkMode ? 'bg-slate-800 border-r-2 border-b-2 border-[#26ECB4]/40' : 'bg-white border-r-2 border-b-2 border-[#EC265F]/40'}`} />
          </div>
          
          {/* Decorative background with brand colors - intensity based on streak */}
          <div className={`absolute inset-0 -m-6 rounded-full bg-gradient-to-br ${isDarkMode ? 'from-[#26ECB4]/20 via-purple-500/10 to-[#EC265F]/20' : 'from-[#EC265F]/10 via-pink-100 to-[#26ECB4]/10'} ${currentStreak >= 3 ? 'blur-3xl' : 'blur-2xl'} group-hover:blur-3xl transition-all duration-500`} />
          
          {/* Mascot image with animation based on feedback */}
          <img 
            src={getMascotData().image} 
            alt="KonnichiWow Mascot" 
            className={`w-36 h-auto relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300 ${showFeedback && isCorrect ? 'animate-bounce' : ''}`}
          />
          
          {/* Corner decorations with streak indicator */}
          <div className={`absolute -bottom-2 -right-2 w-3 h-3 rounded-full bg-gradient-to-br from-[#EC265F] to-[#26ECB4] ${currentStreak >= 2 ? 'animate-ping' : 'animate-pulse'}`} />
          <div className={`absolute -top-2 -left-2 w-2 h-2 rounded-full bg-gradient-to-br from-[#26ECB4] to-[#EC265F] animate-pulse`} style={{ animationDelay: '0.5s' }} />
          
          {/* Streak indicator stars */}
          {currentStreak >= 3 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
              {[...Array(Math.min(currentStreak, 5))].map((_, i) => (
                <span key={i} className="text-xs animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 relative z-10">
        {/* Theme Toggle with styled JW Logo */}
        <div className="absolute top-0 right-4 flex items-center gap-3">
          {/* JW Logo with theme styling */}
          <div className={`relative p-2 rounded-xl ${isDarkMode ? 'bg-slate-800/60 border-[#26ECB4]/30' : 'bg-white/80 border-[#EC265F]/20'} border-2 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300`}>
            <img src={jwLogo} alt="JW" className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#EC265F] to-[#26ECB4] rounded-full animate-pulse" />
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </div>

        {/* Japanese-themed Header with integrated logo */}
        <div className="text-center space-y-6 pt-8">
          <div className={`relative inline-block p-10 rounded-3xl border-4 ${isDarkMode ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-[#26ECB4]/40' : 'bg-gradient-to-br from-white/95 to-pink-50/95 border-[#EC265F]/40'} backdrop-blur-md shadow-2xl`}>
            {/* Decorative corner elements with brand colors */}
            <div className="absolute top-3 left-3 text-2xl animate-pulse">🌸</div>
            <div className="absolute top-3 right-3 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
            <div className="absolute bottom-3 left-3 text-2xl">🎌</div>
            <div className="absolute bottom-3 right-3 text-2xl">🎌</div>
            
            {/* Decorative border accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#EC265F] to-[#26ECB4] rounded-full blur-2xl opacity-30" />
            
            <div className="space-y-6 relative z-10">
              {/* Logo container with decorative elements */}
              <div className="relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#EC265F]/10 via-transparent to-[#26ECB4]/10 rounded-2xl blur-xl" />
                
                {/* Logo with frame */}
                <div className="relative flex justify-center items-center">
                  <div className={`absolute inset-0 -m-4 border-2 ${isDarkMode ? 'border-[#26ECB4]/20' : 'border-[#EC265F]/20'} rounded-2xl`} style={{ clipPath: 'polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))' }} />
                  <img src={konnichiWowLogo} alt="KonnichiWow" className="w-72 h-auto relative z-10 drop-shadow-2xl" />
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-4 -left-4 text-3xl opacity-60">🏮</div>
                <div className="absolute -top-4 -right-4 text-3xl opacity-60">🏮</div>
              </div>
              
              {/* Subtitle with divider */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 justify-center">
                  <div className={`h-px w-12 bg-gradient-to-r ${isDarkMode ? 'from-transparent via-[#26ECB4] to-transparent' : 'from-transparent via-[#EC265F] to-transparent'}`} />
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>日本語練習 | Japanese Practice Quiz</p>
                  <div className={`h-px w-12 bg-gradient-to-r ${isDarkMode ? 'from-transparent via-[#26ECB4] to-transparent' : 'from-transparent via-[#EC265F] to-transparent'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section with Japanese styling */}
        <div className={`space-y-3 p-6 rounded-2xl border-2 ${isDarkMode ? 'bg-slate-800/60 border-[#26ECB4]/20' : 'bg-white/80 border-[#EC265F]/20'} backdrop-blur-sm shadow-xl`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Question {safeQuestionIndex + 1} / {quizData.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Streak Display with Fire */}
              <Badge
                variant={currentStreak > 0 ? "default" : "secondary"}
                className={`px-4 py-2 transition-all duration-300 border-2 ${
                  currentStreak > 0
                    ? 'bg-gradient-to-r from-[#26ECB4] to-cyan-400 border-[#26ECB4] text-gray-900 shadow-lg shadow-[#26ECB4]/30 animate-pulse'
                    : isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-gray-400'
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
              >
                <Flame className={`w-5 h-5 mr-2 ${currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                連続: {currentStreak}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className={`h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} border-2 ${isDarkMode ? 'border-slate-600' : 'border-gray-300'}`}
            />
            <div className="absolute top-0 left-0 right-0 flex justify-around h-4">
              {Array.from({ length: quizData.questions.length }).map((_, i) => (
                <div key={i} className={`w-0.5 h-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </div>



        {/* Question Card with Japanese Design */}
        <Card className={`p-8 md:p-10 ${isDarkMode ? 'bg-slate-800/70 border-[#26ECB4]/20' : 'bg-white/90 border-[#EC265F]/20'} backdrop-blur-sm shadow-2xl rounded-3xl border-4 transition-all duration-300 relative overflow-hidden`}>
          {/* Decorative corner pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill={isDarkMode ? '#26ECB4' : '#EC265F'} />
              <circle cx="50" cy="50" r="30" fill="transparent" stroke="white" strokeWidth="2" />
              <circle cx="50" cy="50" r="20" fill="transparent" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          
          <Question
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            highlightedOption={highlightedOption}
            correctAnswer={currentQuestion.correctAnswer}
            onSelectAnswer={handleSelectAnswer}
            showFeedback={showFeedback}
            isDarkMode={isDarkMode}
          />

          {/* Feedback Section */}
          {showFeedback && (
            <div className="mt-8 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Result Badge */}
              <div className="flex justify-center">
                <Badge
                  className={`px-8 py-4 text-lg shadow-2xl transition-all duration-300 border-2 ${
                    isCorrect
                      ? 'bg-gradient-to-r from-[#26ECB4] to-cyan-400 border-[#26ECB4] text-gray-900 shadow-[#26ECB4]/50 animate-in zoom-in-50 duration-500'
                      : 'bg-gradient-to-r from-[#EC265F] to-pink-500 border-[#EC265F] shadow-[#EC265F]/50 animate-in zoom-in-50 duration-500'
                  }`}
                >
                  {isCorrect ? '✓ 正解! Correct!' : '✗ 不正解 Incorrect'}
                </Badge>
              </div>

              {/* Explanation */}
              {!isCorrect && (
                <div className={`p-6 ${isDarkMode ? 'bg-blue-900/40 border-[#26ECB4]/40' : 'bg-gradient-to-r from-cyan-50 to-blue-50 border-[#26ECB4]/30'} border-3 rounded-2xl shadow-lg`}>
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-[#26ECB4]/20">
                      <Lightbulb className={`w-6 h-6 ${isDarkMode ? 'text-[#26ECB4]' : 'text-[#EC265F]'} flex-shrink-0 animate-pulse`} />
                    </div>
                    <div>
                      <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-1`}>
                        <span className="text-[#EC265F]">💡 ヒン���� (Hint):</span>
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Button */}
              <div className="flex justify-center pt-4">
                <Button
                  ref={nextButtonRef}
                  onClick={handleNextQuestion}
                  className="bg-gradient-to-r from-[#EC265F] to-[#26ECB4] hover:from-[#EC265F]/90 hover:to-[#26ECB4]/90 px-12 py-7 shadow-2xl shadow-[#EC265F]/30 transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-white/20"
                  size="lg"
                >
                  {currentQuestionIndex < quizData.questions.length - 1
                    ? '次へ Next Question'
                    : 'バッジを見る View Badge'}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Keyboard Hints with Japanese styling */}
        {!showFeedback && (
          <div className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-white/60 border-[#EC265F]/10'} backdrop-blur-sm border-2`}>
            <p className="mb-1">⌨️ <span className="font-semibold">キーボード操作 | Keyboard Navigation</span></p>
            <p className="text-xs">
              Press <kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>1</kbd><kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>2</kbd><kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>3</kbd><kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>4</kbd> or <kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>↑</kbd><kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>↓</kbd> to highlight, then <kbd className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-gray-300'} border text-xs mx-1`}>Enter</kbd> to select
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}