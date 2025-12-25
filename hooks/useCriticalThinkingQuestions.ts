// hooks/useCriticalThinkingQuestions.ts
import { useEffect, useState } from "react";
import type { UserScope } from "./useUserScope";

export type CriticalThinkingQuestion = {
    id: string;
    scope: string[];
    medicationId: string;
    medication: string;
    questionType: string;
    stem: string;
    choices: string[];
    correctAnswer: string;
    rationale: string;
    clinicalPearl: string;
};

export function useCriticalThinkingQuestions(scope: UserScope) {
    const [questions, setQuestions] = useState<CriticalThinkingQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadQuestions() {
            setError(null);
            setLoading(true);
            try {
                // Only load questions for RN and Paramedic
                if (scope === "RN") {
                    const response = await fetch(
                        "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/rnQuestions.json"
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch RN questions`);
                    }
                    const data = await response.json();
                    setQuestions(Array.isArray(data) ? data : []);
                } else if (scope === "Paramedic") {
                    const response = await fetch(
                        "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/paramedicQuestions.json"
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch Paramedic questions`);
                    }
                    const data = await response.json();
                    setQuestions(Array.isArray(data) ? data : []);
                } else {
                    // EMT and AEMT don't have questions yet
                    setQuestions([]);
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Failed to load critical thinking questions");
                console.error("Failed to load critical thinking questions:", error);
                setError(error);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        }

        loadQuestions();
    }, [scope]);

    // Filter questions by scope
    const filteredQuestions = questions.filter(
        (q) => Array.isArray(q.scope) && q.scope.includes(scope)
    );

    return { questions: filteredQuestions, loading, error };
}

