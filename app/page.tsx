"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { QuizSlide } from '@/components/quiz/quiz-slide';
import { QuizTimer } from '@/components/quiz/quiz-timer';
import { quizData } from '@/lib/quiz-data';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
    const correctAnswers = answers.reduce((acc, answer, index) => {
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
      title: "Quiz Completed!",
      description: `Your score: ${finalScore.toFixed(1)}%`,
    });
  }, [calculateScore, toast]);

  const handleReset = useCallback(() => {
    setAnswers(new Array(quizData.length).fill(null));
    setIsQuizActive(true);
    setScore(null);
  }, []);

  const answeredCount = answers.filter(a => a !== null).length;
  const progress = (answeredCount / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6 bg-white/50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary">Interactive Quiz</h1>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Progress: {answeredCount}/{quizData.length} questions answered
            </span>
            <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          
          {isQuizActive && (
            <QuizTimer
              duration={QUIZ_DURATION}
              onTimeUp={handleQuizSubmit}
              isActive={isQuizActive}
            />
          )}
        </Card>

        {score !== null && (
          <Card className="p-6 mb-6 bg-white/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">Quiz Results</h2>
            <p className="text-lg">
              Your final score: <span className="font-bold">{score.toFixed(1)}%</span>
            </p>
          </Card>
        )}

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
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
              className="w-full max-w-md"
              disabled={answeredCount !== quizData.length}
            >
              Submit Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}