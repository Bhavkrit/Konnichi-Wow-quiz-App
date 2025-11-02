import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Award, Zap } from 'lucide-react';
import jwLogo from 'figma:asset/7e23a3beff6be864e690ff3a3c80990169a1b4e6.png';
import konnichiWowLogo from 'figma:asset/c9578905348ade8f990cebe7459a2ce8909a2053.png';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Answer {
  questionId: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface SummaryProps {
  questions: Question[];
  answers: Answer[];
  score: number;
  maxStreak: number;
  onRestart: () => void;
  isDarkMode: boolean;
}

export function Summary({ questions, answers, score, maxStreak, onRestart, isDarkMode }: SummaryProps) {
  const percentage = Math.round((score / questions.length) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { text: 'Outstanding!', japanese: '素晴らしい!', emoji: '🎊', color: 'from-[#26ECB4] via-cyan-400 to-blue-400' };
    if (percentage >= 70) return { text: 'Great Job!', japanese: 'よくできました!', emoji: '🌟', color: 'from-[#26ECB4] to-cyan-400' };
    if (percentage >= 50) return { text: 'Good Effort!', japanese: '頑張りました!', emoji: '👏', color: 'from-[#EC265F] to-pink-400' };
    return { text: 'Keep Practicing!', japanese: '練習しましょう!', emoji: '💪', color: 'from-purple-400 to-[#EC265F]' };
  };

  const grade = getGrade();
  
  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      {/* Floating decorative elements */}
      <div className="absolute -top-10 left-10 text-5xl opacity-20 animate-float">🏯</div>
      <div className="absolute -top-5 right-20 text-4xl opacity-20 animate-float-delay">⛩️</div>
      
      {/* JW Logo in corner */}
      <div className="absolute top-4 right-4">
        <div className={`relative p-2 rounded-xl ${isDarkMode ? 'bg-slate-800/60 border-[#26ECB4]/30' : 'bg-white/80 border-[#EC265F]/20'} border-2 backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300`}>
          <img src={jwLogo} alt="JW" className="w-10 h-10" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#EC265F] to-[#26ECB4] rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* KonnichiWow Logo at top with themed styling */}
      <div className="flex justify-center pt-4 pb-4">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EC265F]/20 via-transparent to-[#26ECB4]/20 rounded-2xl blur-2xl" />
          
          {/* Logo container */}
          <div className={`relative p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/60 border-[#26ECB4]/30' : 'bg-white/80 border-[#EC265F]/30'} border-2 backdrop-blur-sm shadow-xl`}>
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#EC265F] rounded-full animate-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#26ECB4] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            <img src={konnichiWowLogo} alt="KonnichiWow" className="w-56 h-auto relative z-10 drop-shadow-xl" />
            
            {/* Bottom decorations */}
            <div className="absolute -bottom-2 left-1/4 w-3 h-3 bg-gradient-to-br from-[#EC265F] to-[#26ECB4] rounded-full" />
            <div className="absolute -bottom-2 right-1/4 w-3 h-3 bg-gradient-to-br from-[#26ECB4] to-[#EC265F] rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Japanese-themed Header with Score */}
      <Card className={`p-10 ${isDarkMode ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-[#26ECB4]/30' : 'bg-gradient-to-br from-white/95 to-pink-50/95'} backdrop-blur-md border-4 shadow-2xl rounded-3xl relative overflow-hidden`}>
        {/* Decorative pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill={isDarkMode ? '#26ECB4' : '#EC265F'} />
            <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="4" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="4" />
          </svg>
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          {/* Trophy with Japanese lanterns */}
          <div className="flex justify-center items-center gap-4">
            <div className="text-4xl animate-bounce">🏮</div>
            <div className="relative">
              <Trophy className={`w-24 h-24 text-[#EC265F] animate-bounce`} />
              <div className="absolute -top-2 -right-2">
                <Award className="w-12 h-12 text-[#26ECB4] animate-pulse" />
              </div>
            </div>
            <div className="text-4xl animate-bounce">🏮</div>
          </div>
          
          {/* Grade Badge */}
          <div className="space-y-2">
            <div className={`inline-block px-8 py-3 rounded-2xl bg-gradient-to-r ${grade.color} shadow-xl border-2 border-white/30`}>
              <h2 className="text-white">{grade.emoji} {grade.text}</h2>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-[#26ECB4]' : 'text-[#EC265F]'}`}>{grade.japanese}</p>
          </div>
          
          {/* Score Display */}
          <div className="space-y-4">
            <div className={`p-8 rounded-3xl ${isDarkMode ? 'bg-slate-700/60 border-[#26ECB4]/30' : 'bg-white/90 border-[#EC265F]/30'} shadow-2xl border-4 relative overflow-hidden`}>
              {/* Cherry blossom decorations */}
              <div className="absolute top-2 left-2 text-2xl opacity-30">🌸</div>
              <div className="absolute bottom-2 right-2 text-2xl opacity-30">🌸</div>
              
              <p className={`text-6xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {score} / {questions.length}
              </p>
              <p className="text-[#EC265F]">あなたのスコア | Your Score</p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-700/60 border-[#26ECB4]/40' : 'bg-gradient-to-br from-[#26ECB4]/30 to-cyan-100'} border-3 border-[#26ECB4]/50 shadow-xl relative overflow-hidden`}>
                <div className="absolute top-0 right-0 text-4xl opacity-10">✅</div>
                <p className="text-4xl text-[#26ECB4] mb-2">{percentage}%</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>正確度 | Accuracy</p>
              </div>
              
              {maxStreak > 0 && (
                <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-slate-700/60 border-orange-400/40' : 'bg-gradient-to-br from-orange-100 to-red-100'} border-3 border-orange-400/50 shadow-xl relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 text-4xl opacity-10">🔥</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-8 h-8 text-orange-500" />
                    <p className="text-4xl text-orange-500">{maxStreak}</p>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>連続 | Best Streak</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Review Section with Japanese styling */}
      <div className="space-y-5">
        <div className={`text-center p-6 rounded-2xl ${isDarkMode ? 'bg-slate-800/60 border-[#26ECB4]/20' : 'bg-white/80 border-[#EC265F]/20'} backdrop-blur-sm shadow-xl border-3 relative`}>
          {/* Decorative elements */}
          <div className="absolute top-2 left-4 text-2xl">📝</div>
          <div className="absolute top-2 right-4 text-2xl">📚</div>
          
          <h2 className={isDarkMode ? 'text-white' : 'text-gray-900'}>復習 | Review Your Answers</h2>
        </div>
        
        {questions.map((question, index) => {
          const answer = answers.find(a => a.questionId === question.id);
          const isCorrect = answer?.isCorrect ?? false;
          
          return (
            <Card 
              key={question.id} 
              className={`p-8 space-y-5 ${isDarkMode ? 'bg-slate-800/70 border-slate-700' : 'bg-white/90 border-gray-200'} backdrop-blur-sm shadow-xl rounded-3xl border-3 transition-all duration-300 hover:scale-[1.01] relative overflow-hidden ${
                isCorrect ? 'border-[#26ECB4]/40 shadow-[#26ECB4]/20' : 'border-[#EC265F]/40 shadow-[#EC265F]/20'
              }`}
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 text-8xl opacity-5`}>
                {isCorrect ? '⭕' : '❌'}
              </div>
              
              <div className="flex items-start gap-5 relative z-10">
                {isCorrect ? (
                  <div className="p-3 rounded-2xl bg-[#26ECB4]/20 border-2 border-[#26ECB4]/40">
                    <CheckCircle2 className="w-8 h-8 text-[#26ECB4] flex-shrink-0" />
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-[#EC265F]/20 border-2 border-[#EC265F]/40">
                    <XCircle className="w-8 h-8 text-[#EC265F] flex-shrink-0" />
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  {/* Question */}
                  <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700/50' : 'bg-gradient-to-r from-[#EC265F]/5 to-[#26ECB4]/5'}`}>
                    <span className={`text-sm ${isDarkMode ? 'text-[#26ECB4]' : 'text-[#EC265F]'}`}>問題 {index + 1} | Question {index + 1}:</span>
                    <p className={`mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{question.question}</p>
                  </div>
                  
                  {/* User's incorrect answer */}
                  {!isCorrect && answer && (
                    <div className={`p-5 ${isDarkMode ? 'bg-[#EC265F]/20 border-[#EC265F]/50' : 'bg-[#EC265F]/10 border-[#EC265F]/40'} rounded-2xl border-3 shadow-lg relative`}>
                      <div className="absolute top-2 right-2 text-xl">❌</div>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        <span className="text-[#EC265F]">あなたの回答 | Your answer:</span>
                      </p>
                      <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {question.options[answer.selectedAnswer]}
                      </p>
                    </div>
                  )}
                  
                  {/* Correct answer */}
                  <div className={`p-5 ${isDarkMode ? 'bg-[#26ECB4]/20 border-[#26ECB4]/50' : 'bg-[#26ECB4]/10 border-[#26ECB4]/40'} rounded-2xl border-3 shadow-lg relative`}>
                    <div className="absolute top-2 right-2 text-xl">✅</div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      <span className="text-[#26ECB4]">正解 | Correct answer:</span>
                    </p>
                    <p className={`mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {question.options[question.correctAnswer]}
                    </p>
                  </div>
                  
                  {/* Explanation */}
                  <div className={`p-5 ${isDarkMode ? 'bg-slate-700/60 border-slate-600' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'} rounded-2xl border-2 shadow-inner relative`}>
                    <div className="absolute top-2 right-2 text-xl">💡</div>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-2`}>
                      <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>説明 | Explanation:</span>
                    </p>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Restart Button with Japanese styling */}
      <div className="flex justify-center pb-8">
        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-[#EC265F] via-pink-500 to-[#26ECB4] hover:from-[#EC265F]/90 hover:via-pink-500/90 hover:to-[#26ECB4]/90 px-12 py-8 shadow-2xl shadow-[#EC265F]/40 transition-all duration-300 hover:scale-105 rounded-3xl border-3 border-white/30 relative overflow-hidden group"
          size="lg"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <RotateCcw className="w-7 h-7 mr-3 relative z-10" />
          <span className="relative z-10">もう一度 | Take Quiz Again</span>
        </Button>
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
