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
    correctAnswer: string | string[]; // string for multiple-choice, string[] for select-all-that-apply
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
                        "https://raw.githubusercontent.com/leatonm/drug-cards-data/refs/heads/main/rnQuestions.json"
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch RN questions`);
                    }
                    const data = await response.json();
                    const questionsArray = Array.isArray(data) ? data : [];
                    console.log(`Loaded ${questionsArray.length} RN questions`);
                    setQuestions(questionsArray);
                } else if (scope === "Paramedic") {
                    const response = await fetch(
                        "https://raw.githubusercontent.com/leatonm/drug-cards-data/refs/heads/main/paramedicQuestions.json"
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch Paramedic questions`);
                    }
                    const data = await response.json();
                    const questionsArray = Array.isArray(data) ? data : [];
                    console.log(`Loaded ${questionsArray.length} Paramedic questions`);
                    setQuestions(questionsArray);
                } else {
                    // EMT and AEMT don't have questions yet
                    setQuestions([]);
                    setLoading(false);
                    return;
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

    // Filter questions by scope and only include multiple-choice questions (skip select-all-that-apply for now)
    const filteredQuestions = questions.filter(
        (q) => {
            // Check if question has required fields
            // Normalize scope comparison - handle both string and array scopes
            let hasScope = false;
            if (Array.isArray(q.scope)) {
                // Check if any scope in the array matches (case-insensitive)
                hasScope = q.scope.some(s => 
                    String(s).trim().toLowerCase() === String(scope).trim().toLowerCase()
                );
            } else if (q.scope) {
                // Handle string scope
                hasScope = String(q.scope).trim().toLowerCase() === String(scope).trim().toLowerCase();
            }
            
            const isMultipleChoice = q.questionType === "multiple-choice";
            // Handle both string and array correctAnswer - allow both types
            const correctAnswerValid = 
                (typeof q.correctAnswer === "string" && q.correctAnswer.trim().length > 0) ||
                (Array.isArray(q.correctAnswer) && q.correctAnswer.length > 0 && q.correctAnswer.every(a => typeof a === "string" && a.trim().length > 0));
            
            const hasChoices = Array.isArray(q.choices) && q.choices.length > 0 && q.choices.every(c => typeof c === "string" && c.trim().length > 0);
            const hasStem = q.stem && typeof q.stem === "string" && q.stem.trim().length > 0;
            
            const isValid = hasScope && isMultipleChoice && correctAnswerValid && hasChoices && hasStem;
            
            // Log why questions are being filtered out (only for first few to avoid spam)
            if (!isValid && questions.length > 0 && questions.indexOf(q) < 3) {
                console.debug("Question filtered out:", {
                    id: q.id,
                    hasScope,
                    scope: q.scope,
                    expectedScope: scope,
                    isMultipleChoice,
                    correctAnswerValid,
                    hasChoices,
                    hasStem,
                    questionType: q.questionType,
                    correctAnswerType: typeof q.correctAnswer,
                });
            }
            
            return isValid;
        }
    );

    // Log filtered results for debugging
    useEffect(() => {
        if (!loading) {
            console.log(`Critical Thinking Questions - Scope: ${scope}, Loaded: ${questions.length}, Filtered: ${filteredQuestions.length}`);
            if (questions.length > 0) {
                // Log scope distribution
                const scopeCounts: Record<string, number> = {};
                questions.forEach(q => {
                    const scopes = Array.isArray(q.scope) ? q.scope : [q.scope];
                    scopes.forEach(s => {
                        const scopeStr = String(s || 'unknown');
                        scopeCounts[scopeStr] = (scopeCounts[scopeStr] || 0) + 1;
                    });
                });
                console.log("Scope distribution in loaded questions:", scopeCounts);
                
                if (filteredQuestions.length === 0) {
                    console.warn("All questions were filtered out! Check the filtering logic.");
                    // Log first question as example
                    if (questions[0]) {
                        console.log("Example question structure:", {
                            id: questions[0].id,
                            scope: questions[0].scope,
                            scopeType: typeof questions[0].scope,
                            expectedScope: scope,
                            questionType: questions[0].questionType,
                            hasStem: !!questions[0].stem,
                            hasChoices: Array.isArray(questions[0].choices),
                            correctAnswerType: typeof questions[0].correctAnswer,
                        });
                    }
                }
            }
        }
    }, [loading, questions.length, filteredQuestions.length, scope]);

    return { questions: filteredQuestions, loading, error };
}

