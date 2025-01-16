"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { QuizSlide } from '@/components/quiz/quiz-slide';
import { QuizTimer } from '@/components/quiz/quiz-timer';
import { QuizProgress } from '@/components/quiz/quiz-progress';
import { quizData } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCcw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const QUIZ_DURATION = 300; // 5 minutes in seconds

export default function Home() {
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null));
  const [isQuizActive, setIsQuizActive] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleAnswerSelect = useCallback((questionIndex: number, answerId: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerId;
      return newAnswers;
    });
  }, []);

  const calculateScore = useCallback(() => {
    const correctAnswers = answers.reduce<number>((acc, answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return (correctAnswers / quizData.length) * 100;
  }, [answers]);

  const handleQuizSubmit = useCallback(() => {
    setIsQuizActive(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    
    toast({
      title: "Quiz Completed! 🎉",
      description: `Your score: ${finalScore.toFixed(1)}%`,
    });
  }, [calculateScore, toast]);

  const handleReset = useCallback(() => {
    setAnswers(new Array(quizData.length).fill(null));
    setIsQuizActive(true);
    setScore(null);
  }, []);

  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 mb-6 bg-white/50 backdrop-blur-sm border-none shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interactive Quiz
              </h1>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
            
            <QuizProgress
              answeredCount={answeredCount}
              totalQuestions={quizData.length}
            />
            
            {isQuizActive && (
              <QuizTimer
                duration={QUIZ_DURATION}
                onTimeUp={handleQuizSubmit}
                isActive={isQuizActive}
              />
            )}
          </Card>
        </motion.div>

        {score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 mb-6 bg-white/50 backdrop-blur-sm border-none shadow-lg">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <h2 className="text-xl font-semibold mb-1">Quiz Results</h2>
                  <p className="text-lg">
                    Your final score: <span className="font-bold">{score.toFixed(1)}%</span>
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Keyboard]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
            }}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            pagination={{ clickable: true }}
            className="h-[400px]"
          >
            {quizData.map((question, index) => (
              <SwiperSlide key={question.id}>
                <QuizSlide
                  question={question}
                  selectedAnswer={answers[index]}
                  onAnswerSelect={(answerId) => handleAnswerSelect(index, answerId)}
                  questionNumber={index + 1}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" className="swiper-button-prev flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button variant="outline" className="swiper-button-next flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {isQuizActive && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleQuizSubmit}
                className="w-full max-w-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                disabled={answeredCount !== quizData.length}
              >
                Submit Quiz
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}