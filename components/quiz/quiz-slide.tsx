"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from '@/lib/quiz-data';

interface QuizSlideProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerId: number) => void;
}

export function QuizSlide({ question, selectedAnswer, onAnswerSelect }: QuizSlideProps) {
  return (
    <Card className="p-6 h-full flex flex-col justify-between bg-white/50 backdrop-blur-sm">
      <div>
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`q${question.id}-option${index}`} />
              <Label htmlFor={`q${question.id}-option${index}`} className="text-base">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}