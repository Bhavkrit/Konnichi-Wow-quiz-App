import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  highlightedOption: number | null;
  correctAnswer: number;
  onSelectAnswer: (index: number) => void;
  showFeedback: boolean;
  isDarkMode: boolean;
}

export function Question({
  question,
  options,
  selectedAnswer,
  highlightedOption,
  correctAnswer,
  onSelectAnswer,
  showFeedback,
  isDarkMode,
}: QuestionProps) {
  const getOptionClassName = (index: number) => {
    const baseClasses = 'w-full p-6 text-left border-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-md relative overflow-hidden';
    
    if (!showFeedback) {
      // Highlighted option (keyboard navigation)
      if (index === highlightedOption) {
        if (isDarkMode) {
          return `${baseClasses} border-[#EC265F] bg-[#EC265F]/20 shadow-xl shadow-[#EC265F]/30 scale-[1.02] ring-2 ring-[#EC265F]/50`;
        }
        return `${baseClasses} border-[#EC265F] bg-gradient-to-r from-[#EC265F]/20 to-pink-50 shadow-xl shadow-[#EC265F]/30 scale-[1.02] ring-2 ring-[#EC265F]/50`;
      }
      
      if (isDarkMode) {
        return `${baseClasses} border-[#26ECB4]/30 bg-slate-700/50 hover:border-[#EC265F] hover:bg-[#EC265F]/10 hover:shadow-xl hover:shadow-[#EC265F]/20`;
      }
      return `${baseClasses} border-[#EC265F]/30 bg-white hover:border-[#EC265F] hover:bg-gradient-to-r hover:from-[#EC265F]/10 hover:to-pink-50 hover:shadow-xl hover:shadow-[#EC265F]/20`;
    }
    
    if (index === correctAnswer) {
      return `${baseClasses} border-[#26ECB4] bg-gradient-to-r from-[#26ECB4]/30 to-cyan-100/50 shadow-xl shadow-[#26ECB4]/40 ${isDarkMode ? 'bg-[#26ECB4]/20' : ''}`;
    }
    
    if (index === selectedAnswer && index !== correctAnswer) {
      return `${baseClasses} border-[#EC265F] bg-gradient-to-r from-[#EC265F]/30 to-pink-100/50 shadow-xl shadow-[#EC265F]/40 ${isDarkMode ? 'bg-[#EC265F]/20' : ''}`;
    }
    
    if (isDarkMode) {
      return `${baseClasses} border-slate-700 bg-slate-800/30 opacity-50`;
    }
    return `${baseClasses} border-gray-200 bg-gray-50 opacity-50`;
  };

  const getOptionIcon = (index: number) => {
    if (!showFeedback) return null;
    
    if (index === correctAnswer) {
      return (
        <div className="p-2 rounded-full bg-[#26ECB4]/30">
          <CheckCircle2 className="w-7 h-7 text-[#26ECB4] animate-in zoom-in-50 duration-500" />
        </div>
      );
    }
    
    if (index === selectedAnswer && index !== correctAnswer) {
      return (
        <div className="p-2 rounded-full bg-[#EC265F]/30">
          <XCircle className="w-7 h-7 text-[#EC265F] animate-in zoom-in-50 duration-500" />
        </div>
      );
    }
    
    return null;
  };

  const japaneseNumbers = ['一', '二', '三', '四'];

  return (
    <div className="space-y-6">
      {/* Question Header with Japanese styling */}
      <div className={`relative text-center px-6 py-5 rounded-2xl border-2 ${isDarkMode ? 'bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-[#26ECB4]/20' : 'bg-gradient-to-r from-[#EC265F]/10 via-white to-[#26ECB4]/10 border-[#EC265F]/30'} shadow-lg`}>
        {/* Corner decorations */}
        <div className="absolute top-1 left-2 opacity-30">🌸</div>
        <div className="absolute top-1 right-2 opacity-30">🌸</div>
        
        <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} px-8`}>{question}</h2>
      </div>
      
      {/* Options with Japanese characters */}
      <div className="space-y-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showFeedback && onSelectAnswer(index)}
            disabled={showFeedback}
            className={getOptionClassName(index)}
            aria-label={`Option ${index + 1}: ${option}`}
            aria-pressed={selectedAnswer === index}
          >
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 opacity-5 text-6xl pointer-events-none">
              {index === 0 && '🏯'}
              {index === 1 && '⛩️'}
              {index === 2 && '🎌'}
              {index === 3 && '🗾'}
            </div>
            
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Number badge with Japanese character */}
                <div className="flex flex-col items-center gap-1">
                  <span className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 transition-all duration-300 border-2 ${
                    showFeedback && index === correctAnswer
                      ? 'bg-gradient-to-br from-[#26ECB4] to-cyan-400 text-gray-900 shadow-lg border-[#26ECB4]'
                      : showFeedback && index === selectedAnswer && index !== correctAnswer
                      ? 'bg-gradient-to-br from-[#EC265F] to-pink-500 text-white shadow-lg border-[#EC265F]'
                      : isDarkMode
                      ? 'bg-slate-600 text-gray-200 border-slate-500'
                      : 'bg-gradient-to-br from-[#EC265F]/10 to-[#26ECB4]/10 text-[#EC265F] border-[#EC265F]/30'
                  }`}>
                    {index + 1}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {japaneseNumbers[index]}
                  </span>
                </div>
                <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{option}</span>
              </div>
              {getOptionIcon(index)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
