// hooks/useQuiz.ts
import { useEffect, useMemo, useRef, useState } from "react";
import type { Drug } from "./getDrugs";
import type { CriticalThinkingQuestion } from "./useCriticalThinkingQuestions";

// ---------------------
// QUESTION GENERATOR
// ---------------------

type Question = {
    question: string;
    correct: string;
    choices: string[];
};

type QuestionType = 
    | "adult" 
    | "pediatric" 
    | "class" 
    | "indication" 
    | "contra" 
    | "mechanism" 
    | "interaction" 
    | "education";

// Fisher-Yates shuffle algorithm for proper randomization
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateQuestion(drug: Drug, allDrugs: Drug[]): Question | null {
    // Validate required fields
    if (!drug.class || !drug.mechanism || !drug.indications?.length || !drug.contraindications?.length) {
        return null;
    }

    const questionTypes: QuestionType[] = [];

    if (drug.adultDose) questionTypes.push("adult");
    if (drug.pediatricDose) questionTypes.push("pediatric");

    questionTypes.push("class", "indication", "contra", "mechanism");

    if (drug.interactions?.length) questionTypes.push("interaction");
    if (drug.education?.length) questionTypes.push("education");

    if (questionTypes.length === 0) {
        return null;
    }

    const type: QuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let questionText = "";
    let correctAnswer = "";

    switch (type) {
        case "adult":
            if (!drug.adultDose) return null;
            questionText = "What is the adult dosage?";
            correctAnswer = drug.adultDose;
            break;

        case "pediatric":
            if (!drug.pediatricDose) return null;
            questionText = "What is the pediatric dosage?";
            correctAnswer = drug.pediatricDose;
            break;

        case "class":
            questionText = "What is the drug class?";
            correctAnswer = drug.class;
            break;

        case "mechanism":
            questionText = "What is the mechanism of action?";
            correctAnswer = drug.mechanism;
            break;

        case "indication":
            if (!drug.indications.length) return null;
            questionText = "Which of these is an indication?";
            correctAnswer =
                drug.indications[Math.floor(Math.random() * drug.indications.length)];
            break;

        case "contra":
            if (!drug.contraindications.length) return null;
            questionText = "Which of these is a contraindication?";
            correctAnswer =
                drug.contraindications[Math.floor(Math.random() * drug.contraindications.length)];
            break;

        case "interaction":
            if (!drug.interactions?.length) return null;
            questionText = "Which of these is a drug interaction?";
            correctAnswer =
                drug.interactions[Math.floor(Math.random() * drug.interactions.length)];
            break;

        case "education":
            if (!drug.education?.length) return null;
            questionText = "Which is appropriate patient education?";
            correctAnswer =
                drug.education[Math.floor(Math.random() * drug.education.length)];
            break;
    }

    if (!questionText || !correctAnswer) {
        return null;
    }

    // Generate wrong answers - optimized approach
    // First, collect all possible wrong answers from other drugs
    const possibleWrongAnswers = new Set<string>();
    
    for (const rand of allDrugs) {
        if (rand.id === drug.id) continue; // Skip the current drug
        
        let wrong = "";
        switch (type) {
            case "adult":
                wrong = rand.adultDose ?? "";
                break;
            case "pediatric":
                wrong = rand.pediatricDose ?? "";
                break;
            case "class":
                wrong = rand.class ?? "";
                break;
            case "mechanism":
                wrong = rand.mechanism ?? "";
                break;
            case "indication":
                if (rand.indications?.length) {
                    const randomIndex = Math.floor(Math.random() * rand.indications.length);
                    wrong = rand.indications[randomIndex];
                }
                break;
            case "contra":
                if (rand.contraindications?.length) {
                    const randomIndex = Math.floor(Math.random() * rand.contraindications.length);
                    wrong = rand.contraindications[randomIndex];
                }
                break;
            case "interaction":
                if (rand.interactions?.length) {
                    const randomIndex = Math.floor(Math.random() * rand.interactions.length);
                    wrong = rand.interactions[randomIndex];
                }
                break;
            case "education":
                if (rand.education?.length) {
                    const randomIndex = Math.floor(Math.random() * rand.education.length);
                    wrong = rand.education[randomIndex];
                }
                break;
        }

        if (wrong && wrong !== correctAnswer) {
            possibleWrongAnswers.add(wrong);
        }
    }

    // Convert to array and shuffle, then take 2 random ones
    const wrongAnswersArray = Array.from(possibleWrongAnswers);
    const shuffledWrong = shuffleArray(wrongAnswersArray);
    const wrongAnswers = new Set(shuffledWrong.slice(0, 2));

    // If we couldn't get enough wrong answers, fill with placeholder
    while (wrongAnswers.size < 2) {
        wrongAnswers.add("N/A");
    }

    const choices = shuffleArray([...wrongAnswers, correctAnswer]);

    return {
        question: questionText,
        correct: correctAnswer,
        choices,
    };
}

// ---------------------
// QUIZ HOOK
// ---------------------

export type QuizAnswer = {
    drug?: Drug;
    question: string;
    correctAnswer: string;
    userAnswer: string;
    choices: string[];
    isCorrect: boolean;
    isCriticalThinking?: boolean;
    rationale?: string;
    clinicalPearl?: string;
    medication?: string;
};

export function useQuiz(
    drugs: Drug[],
    questionCount: number = 10,
    criticalThinkingQuestions: CriticalThinkingQuestion[] = []
) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const lockedQuestionsRef = useRef<typeof questions | null>(null);

    const questions = useMemo(() => {
        const allQuestions: Array<{
            drug?: Drug;
            question: string;
            correct: string;
            choices: string[];
            isCriticalThinking?: boolean;
            rationale?: string;
            clinicalPearl?: string;
            medication?: string;
        }> = [];

        // First, determine how many critical thinking questions to include (30% of total)
        let criticalCount = 0;
        let criticalToAdd: typeof criticalThinkingQuestions = [];
        
        if (criticalThinkingQuestions && criticalThinkingQuestions.length > 0) {
            // Calculate how many critical questions to add (30% of questionCount, but not more than available)
            criticalCount = Math.min(
                Math.floor(questionCount * 0.3),
                criticalThinkingQuestions.length
            );
            
            // Shuffle and select critical questions
            const criticalCopy = [...criticalThinkingQuestions];
            const shuffledCritical = criticalCopy.sort(() => Math.random() - 0.5);
            criticalToAdd = shuffledCritical.slice(0, criticalCount);
            
            console.log(`Will mix in ${criticalCount} critical thinking questions out of ${criticalThinkingQuestions.length} available`);
        }

        // Generate regular questions - only generate enough to fill the remaining slots
        const regularQuestionCount = questionCount - criticalCount;
        
        if (drugs && drugs.length > 0 && regularQuestionCount > 0) {
            const validDrugs = drugs.filter(
                (drug) =>
                    drug.class &&
                    drug.mechanism &&
                    drug.indications?.length &&
                    drug.contraindications?.length
            );

            if (validDrugs.length > 0) {
                const generatedQuestions: Array<{
                    drug: Drug;
                    question: string;
                    correct: string;
                    choices: string[];
                }> = [];
                const maxAttempts = regularQuestionCount * 10;
                let attempts = 0;

                while (
                    generatedQuestions.length < regularQuestionCount &&
                    attempts < maxAttempts
                ) {
                    attempts++;
                    const randomDrug =
                        validDrugs[
                            Math.floor(Math.random() * validDrugs.length)
                        ];
                    const question = generateQuestion(randomDrug, drugs);

                    if (question) {
                        generatedQuestions.push({
                            drug: randomDrug,
                            ...question,
                        });
                    }
                }

                allQuestions.push(...generatedQuestions);
            }
        }

        // Add critical thinking questions
        criticalToAdd.forEach((ctq) => {
            // Validate the question before adding
            // Ensure correctAnswer is a string (not an array for select-all-that-apply)
            const isValid = ctq.stem && 
                typeof ctq.correctAnswer === "string" && 
                ctq.correctAnswer.length > 0 &&
                Array.isArray(ctq.choices) && 
                ctq.choices.length > 0;
            
            if (isValid) {
                allQuestions.push({
                    question: ctq.stem,
                    correct: ctq.correctAnswer,
                    choices: ctq.choices,
                    isCriticalThinking: true,
                    rationale: ctq.rationale,
                    clinicalPearl: ctq.clinicalPearl,
                    medication: ctq.medication,
                });
            } else {
                console.warn("Skipping invalid critical thinking question:", {
                    id: ctq.id,
                    hasStem: !!ctq.stem,
                    correctAnswerType: typeof ctq.correctAnswer,
                    hasChoices: Array.isArray(ctq.choices),
                    choicesLength: ctq.choices?.length || 0,
                });
            }
        });

        // Shuffle all questions together to mix them randomly
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const finalQuestions = shuffled;
        
        // Count critical thinking questions in final set
        const criticalInFinal = finalQuestions.filter(q => q.isCriticalThinking).length;
        const regularInFinal = finalQuestions.length - criticalInFinal;
        console.log(`Quiz generated: ${finalQuestions.length} total questions (${criticalInFinal} critical thinking, ${regularInFinal} regular) - randomly mixed`);
        
        // Debug logging
        if (finalQuestions.length === 0) {
            console.warn("No questions generated:", {
                drugsCount: drugs?.length || 0,
                criticalCount: criticalThinkingQuestions?.length || 0,
                questionCount,
                allQuestionsCount: allQuestions.length,
            });
        } else if (criticalInFinal === 0 && criticalThinkingQuestions && criticalThinkingQuestions.length > 0) {
            console.warn("No critical thinking questions were included despite being available. Check validation logic.");
        }
        
        return finalQuestions;
    }, [drugs, questionCount, criticalThinkingQuestions]);

    // Lock questions once they're first available to prevent regeneration when critical thinking questions load
    // This prevents questions from changing when critical thinking questions load asynchronously
    const stableQuestions = useMemo(() => {
        // If we've already locked questions, always use the locked version
        if (lockedQuestionsRef.current) {
            return lockedQuestionsRef.current;
        }
        
        // If we have questions and haven't locked yet, lock them now
        if (questions.length > 0) {
            lockedQuestionsRef.current = questions;
            return questions;
        }
        
        return questions;
    }, [questions]);

    // Reset quiz state when questions change (drugs or questionCount changes)
    // Only reset if questions haven't been locked yet
    useEffect(() => {
        // If questions are empty, don't reset (wait for them to load)
        if (stableQuestions.length === 0) return;
        
        // Only reset if we haven't locked questions yet (quiz hasn't started)
        if (!lockedQuestionsRef.current) {
            setCurrentIndex(0);
            setScore(0);
            setFinished(false);
            setAnswers([]);
        }
    }, [stableQuestions.length]);

    const current = stableQuestions[currentIndex];

    function selectAnswer(answer: string) {
        if (finished || currentIndex >= stableQuestions.length || !current) {
            return;
        }

        const isCorrect = answer === current.correct;
        if (isCorrect) {
            setScore((s) => s + 1);
        }

        // Track the answer for review
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[currentIndex] = {
                drug: current.drug,
                question: current.question,
                correctAnswer: current.correct,
                userAnswer: answer,
                choices: current.choices,
                isCorrect,
                isCriticalThinking: current.isCriticalThinking,
                rationale: current.rationale,
                clinicalPearl: current.clinicalPearl,
                medication: current.medication,
            };
            return newAnswers;
        });
    }

    function next() {
        if (currentIndex + 1 >= stableQuestions.length) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
        }
    }

    // Ensure we have a valid current question
    const hasValidQuestion = current && 
        current.question && 
        typeof current.question === "string" &&
        current.choices && 
        Array.isArray(current.choices) &&
        current.choices.length > 0 &&
        current.correct &&
        typeof current.correct === "string";

    return {
        currentDrug: current?.drug,
        question: hasValidQuestion ? current.question : undefined,
        choices: hasValidQuestion ? current.choices : [],
        correctAnswer: hasValidQuestion ? current.correct : undefined,
        currentIndex,
        total: stableQuestions.length,
        selectAnswer,
        next,
        finished: finished || questions.length === 0,
        score,
        answers, // All answers for review
        hasAnswered: false, // Removed - QuizCard manages this state
        isCriticalThinking: current?.isCriticalThinking,
        rationale: current?.rationale,
        clinicalPearl: current?.clinicalPearl,
        medication: current?.medication,
    };
}
