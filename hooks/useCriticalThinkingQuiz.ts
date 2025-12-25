// hooks/useCriticalThinkingQuiz.ts
import { useEffect, useMemo, useState } from "react";
import type { CriticalThinkingQuestion } from "./useCriticalThinkingQuestions";

export type CriticalThinkingAnswer = {
    question: CriticalThinkingQuestion;
    userAnswer: string;
    isCorrect: boolean;
};

export function useCriticalThinkingQuiz(
    questions: CriticalThinkingQuestion[],
    questionCount: number = 10
) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<CriticalThinkingAnswer[]>([]);

    // Shuffle and limit questions
    const quizQuestions = useMemo(() => {
        if (!questions || questions.length === 0) {
            return [];
        }

        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(questionCount, shuffled.length));
    }, [questions, questionCount]);

    // Reset quiz state when questions change
    useEffect(() => {
        setCurrentIndex(0);
        setScore(0);
        setFinished(false);
        setAnswers([]);
    }, [quizQuestions]);

    const current = quizQuestions[currentIndex];

    function selectAnswer(answer: string) {
        if (finished || currentIndex >= quizQuestions.length || !current) {
            return;
        }

        const isCorrect = answer === current.correctAnswer;
        if (isCorrect) {
            setScore((s) => s + 1);
        }

        // Track the answer for review
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentIndex] = {
                question: current,
                userAnswer: answer,
                isCorrect,
            };
            return newAnswers;
        });
    }

    function next() {
        if (currentIndex + 1 >= quizQuestions.length) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }

    return {
        currentQuestion: current,
        currentIndex,
        total: quizQuestions.length,
        selectAnswer,
        next,
        finished,
        score,
        answers,
    };
}

