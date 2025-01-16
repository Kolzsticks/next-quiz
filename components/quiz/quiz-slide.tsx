"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import type { Question } from '@/lib/quiz-data';

interface QuizSlideProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (answerId: number) => void;
  questionNumber: number;
}

export function QuizSlide({ question, selectedAnswer, onAnswerSelect, questionNumber }: QuizSlideProps) {
  return (
    <Card className="p-8 h-full flex flex-col justify-between bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <div>
        <div className="mb-6">
          <span className="text-sm font-medium text-muted-foreground">
            Question {questionNumber}
          </span>
          <h3 className="text-2xl font-semibold mt-2">{question.question}</h3>
        </div>
        
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-4"
        >
          {question.options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <RadioGroupItem
                value={index.toString()}
                id={`q${question.id}-option${index}`}
                className="w-5 h-5"
              />
              <Label
                htmlFor={`q${question.id}-option${index}`}
                className="text-lg cursor-pointer hover:text-primary transition-colors"
              >
                {option}
              </Label>
            </motion.div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}