'use client';

import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizzesModule: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const questions = [
    {
      q: 'Which chemical indicator turns pink in basic solutions above pH 8.2?',
      options: ['Methyl Orange', 'Phenolphthalein', 'Litmus Paper', 'Universal Indicator'],
      correct: 1,
      explanation: 'Phenolphthalein is colorless in acidic solutions and turns magenta/pink in basic solutions (pH > 8.2).'
    },
    {
      q: 'What is Snell’s Law formula for light refraction at a planar boundary?',
      options: ['n1 / sin(θ1) = n2 / sin(θ2)', 'n1 × sin(θ1) = n2 × sin(θ2)', 'n1 + n2 = sin(θ1 + θ2)', 'n1 × cos(θ1) = n2 × cos(θ2)'],
      correct: 1,
      explanation: 'Snell’s Law states n1 × sin(θ1) = n2 × sin(θ2), relating indices of refraction to angles of incidence and refraction.'
    },
    {
      q: 'In a simple pendulum experiment, plotting T² vs L yields a straight line with slope equal to:',
      options: ['g / 2π', '4π² / g', '2π / g', 'g / 4π²'],
      correct: 1,
      explanation: 'Since T = 2π √(L/g), T² = (4π²/g)L. The slope m = 4π²/g, from which g can be determined.'
    },
    {
      q: 'What is the function of alcohol in plant DNA extraction protocols?',
      options: ['To dissolve the cell wall', 'To break cell membranes', 'To precipitate insoluble DNA out of solution', 'To denature lipids'],
      correct: 2,
      explanation: 'Cold ethanol or isopropyl alcohol reduces DNA solubility, causing long DNA strands to clump together and precipitate.'
    }
  ];

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;
    const updatedAnswers = [...userAnswers, selectedOption];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizSubmitted(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const calculateScore = () => {
    let score = 0;
    userAnswers.forEach((ans, idx) => {
      if (ans === questions[idx].correct) score += 1;
    });
    return score;
  };

  const handleResetQuiz = () => {
    setActiveQuiz(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="clay-card p-6 sm:p-8">
        {!activeQuiz ? (
          /* Quiz Overview List */
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold uppercase">
                  Automated Evaluation
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-purple-950 mt-1">
                  Science Practical Quizzes
                </h2>
                <p className="text-xs text-purple-600 font-medium">Test apparatus setup, titrations, ray optics, and formulas</p>
              </div>

              <button
                onClick={() => setActiveQuiz(true)}
                className="clay-btn px-6 py-3 text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition"
              >
                <Sparkles className="w-4 h-4" /> Start Featured Practical Quiz
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quiz Card 1 */}
              <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-100 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 text-[10px] font-extrabold uppercase">
                    FEATURED • 4 QUESTIONS
                  </span>
                  <span className="text-xs text-purple-600 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 10 Mins
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-purple-950">Optics & Titration Practical Quiz</h3>
                  <p className="text-xs text-purple-700/80 mt-1">Covers phenolphthalein pH endpoints, Snell's law, pendulum slopes, and DNA isolation techniques.</p>
                </div>
                <button
                  onClick={() => setActiveQuiz(true)}
                  className="w-full clay-btn py-2.5 text-xs font-bold"
                >
                  Attempt Quiz Now →
                </button>
              </div>

              {/* Quiz Card 2 (Completed) */}
              <div className="p-6 rounded-3xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase">
                    COMPLETED • LAST SCORE: 92%
                  </span>
                  <span className="text-xs text-emerald-700 font-bold">Jul 24</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-emerald-950">Chemical Indicators & Buffers Quiz</h3>
                  <p className="text-xs text-emerald-800/80 mt-1">Acid-base neutralization, buffer capacity curves, and error analysis.</p>
                </div>
                <button
                  disabled
                  className="w-full py-2.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold cursor-not-allowed"
                >
                  ✓ Passed (Score: 92/100)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Active Interactive Quiz Taker */
          <div className="max-w-2xl mx-auto space-y-6">
            {!quizSubmitted ? (
              <div className="space-y-6">
                {/* Quiz Header Progress */}
                <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                  <div>
                    <span className="text-xs font-extrabold text-purple-600 uppercase">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </span>
                    <h3 className="font-black text-lg text-purple-950">Practical Quiz Session</h3>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-purple-500 font-bold hover:underline"
                  >
                    Exit Quiz
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-purple-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question */}
                <div className="p-6 rounded-3xl bg-purple-50/80 border border-purple-100 space-y-4">
                  <p className="font-bold text-base text-purple-950">
                    {questions[currentQuestionIndex].q}
                  </p>

                  <div className="space-y-2.5">
                    {questions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full p-3.5 rounded-2xl text-xs font-bold text-left transition flex items-center justify-between border ${
                          selectedOption === idx
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100/50'
                        }`}
                      >
                        <span>{option}</span>
                        {selectedOption === idx && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    disabled={selectedOption === null}
                    onClick={handleNextQuestion}
                    className={`clay-btn px-6 py-3 text-xs font-bold flex items-center gap-2 ${
                      selectedOption === null ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                    }`}
                  >
                    <span>{currentQuestionIndex + 1 === questions.length ? 'Submit Quiz' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Score Breakdown & Answers Review */
              <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center shadow-lg">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-purple-950">Quiz Completed!</h3>
                  <p className="text-xs text-purple-600 font-bold mt-1">Here is your practical assessment breakdown:</p>
                </div>

                <div className="p-6 rounded-3xl bg-purple-50 border border-purple-100 max-w-sm mx-auto">
                  <p className="text-4xl font-black text-purple-950">
                    {calculateScore()} / {questions.length}
                  </p>
                  <p className="text-xs font-extrabold text-purple-600 uppercase mt-1">
                    {Math.round((calculateScore() / questions.length) * 100)}% Overall Score
                  </p>
                </div>

                {/* Explanations List */}
                <div className="space-y-3 text-left">
                  <h4 className="font-extrabold text-sm text-purple-950">Detailed Explanations:</h4>
                  {questions.map((q, idx) => {
                    const userAns = userAnswers[idx];
                    const isCorrect = userAns === q.correct;
                    return (
                      <div key={idx} className={`p-4 rounded-2xl border text-xs space-y-1 ${
                        isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                      }`}>
                        <div className="flex items-center justify-between font-bold">
                          <span>Q{idx + 1}: {q.q}</span>
                          <span className="flex items-center gap-1 shrink-0">
                            {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleResetQuiz}
                  className="clay-btn px-6 py-3 text-xs font-bold inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again or Retake
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
