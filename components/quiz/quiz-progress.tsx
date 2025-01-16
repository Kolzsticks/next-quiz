"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface QuizProgressProps {
  answeredCount: number;
  totalQuestions: number;
}

export function QuizProgress({ answeredCount, totalQuestions }: QuizProgressProps) {
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <Card className="p-4 mb-4 bg-white/50 backdrop-blur-sm border-none shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary" />
          <span className="font-medium">Progress</span>
        </div>
        <span className="text-sm font-medium">
          {answeredCount}/{totalQuestions} questions answered
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </Card>
  );
}