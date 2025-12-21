// hooks/useStatistics.ts
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type QuizStats = {
    totalQuizzes: number;
    totalQuestions: number;
    totalCorrect: number;
    averageScore: number;
    bestScore: number;
    lastQuizDate: string | null;
};

const STORAGE_KEY = "quiz_statistics";

const defaultStats: QuizStats = {
    totalQuizzes: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    averageScore: 0,
    bestScore: 0,
    lastQuizDate: null,
};

export function useStatistics() {
    const [stats, setStats] = useState<QuizStats>(defaultStats);
    const [loading, setLoading] = useState(true);

    // Load stats on mount
    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setStats(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load statistics:", error);
        } finally {
            setLoading(false);
        }
    }

    async function recordQuiz(score: number, total: number) {
        try {
            const currentStats = await loadCurrentStats();
            
            const newStats: QuizStats = {
                totalQuizzes: currentStats.totalQuizzes + 1,
                totalQuestions: currentStats.totalQuestions + total,
                totalCorrect: currentStats.totalCorrect + score,
                averageScore: 
                    (currentStats.totalCorrect + score) / 
                    (currentStats.totalQuestions + total) * 100,
                bestScore: Math.max(currentStats.bestScore, (score / total) * 100),
                lastQuizDate: new Date().toISOString(),
            };

            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
            setStats(newStats);
        } catch (error) {
            console.error("Failed to record quiz:", error);
        }
    }

    async function resetStats() {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
            setStats(defaultStats);
        } catch (error) {
            console.error("Failed to reset statistics:", error);
        }
    }

    async function loadCurrentStats(): Promise<QuizStats> {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultStats;
        } catch {
            return defaultStats;
        }
    }

    return {
        stats,
        loading,
        recordQuiz,
        resetStats,
        refresh: loadStats,
    };
}

