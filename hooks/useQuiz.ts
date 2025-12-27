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

// Normalize string for comparison (trim, lowercase, remove extra spaces)
function normalizeString(str: string): string {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Check if two strings are similar (normalized comparison)
function areSimilar(str1: string, str2: string): boolean {
    const norm1 = normalizeString(str1);
    const norm2 = normalizeString(str2);
    
    // Exact match after normalization
    if (norm1 === norm2) return true;
    
    // Check if one contains the other (for cases like "2-5 mg" vs "2-5mg")
    if (norm1.length > 0 && norm2.length > 0) {
        const longer = norm1.length > norm2.length ? norm1 : norm2;
        const shorter = norm1.length > norm2.length ? norm2 : norm1;
        if (longer.includes(shorter) && shorter.length >= Math.min(5, longer.length * 0.7)) {
            return true;
        }
    }
    
    return false;
}

// Check if an answer is distinct from all existing answers
function isDistinct(answer: string, existingAnswers: string[]): boolean {
    if (!answer || answer.trim() === "" || answer === "N/A") {
        return false;
    }
    
    for (const existing of existingAnswers) {
        if (areSimilar(answer, existing)) {
            return false;
        }
    }
    
    return true;
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

    // Generate wrong answers - collect all distinct answers from other drugs
    const possibleWrongAnswers: string[] = [];
    
    for (const rand of allDrugs) {
        if (rand.id === drug.id) continue; // Skip the current drug
        
        let wrongAnswers: string[] = [];
        
        switch (type) {
            case "adult":
                if (rand.adultDose) wrongAnswers = [rand.adultDose];
                break;
            case "pediatric":
                if (rand.pediatricDose) wrongAnswers = [rand.pediatricDose];
                break;
            case "class":
                if (rand.class) wrongAnswers = [rand.class];
                break;
            case "mechanism":
                if (rand.mechanism) wrongAnswers = [rand.mechanism];
                break;
            case "indication":
                // Collect ALL indications from this drug for more variety
                if (rand.indications?.length) {
                    wrongAnswers = rand.indications;
                }
                break;
            case "contra":
                // Collect ALL contraindications from this drug for more variety
                if (rand.contraindications?.length) {
                    wrongAnswers = rand.contraindications;
                }
                break;
            case "interaction":
                // Collect ALL interactions from this drug for more variety
                if (rand.interactions?.length) {
                    wrongAnswers = rand.interactions;
                }
                break;
            case "education":
                // Collect ALL education items from this drug for more variety
                if (rand.education?.length) {
                    wrongAnswers = rand.education;
                }
                break;
        }

        // Add all wrong answers that are distinct from the correct answer
        for (const wrong of wrongAnswers) {
            if (wrong && !areSimilar(wrong, correctAnswer)) {
                possibleWrongAnswers.push(wrong);
            }
        }
    }

    // Filter to only distinct answers (no duplicates or similar answers)
    const distinctWrongAnswers: string[] = [];
    for (const answer of possibleWrongAnswers) {
        if (isDistinct(answer, [correctAnswer, ...distinctWrongAnswers])) {
            distinctWrongAnswers.push(answer);
        }
    }

    // Shuffle and take 2 random distinct wrong answers
    const shuffledWrong = shuffleArray(distinctWrongAnswers);
    const selectedWrongAnswers = shuffledWrong.slice(0, 2);

    // If we couldn't get enough distinct wrong answers, try to fill with more
    // by being less strict about similarity, but still avoid exact matches
    let finalWrongAnswers = [...selectedWrongAnswers];
    if (finalWrongAnswers.length < 2) {
        const remaining = shuffledWrong.slice(2);
        for (const answer of remaining) {
            if (finalWrongAnswers.length >= 2) break;
            // Only check against correct answer and existing wrong answers (not similarity)
            if (answer && normalizeString(answer) !== normalizeString(correctAnswer)) {
                const isDuplicate = finalWrongAnswers.some(existing => 
                    normalizeString(existing) === normalizeString(answer)
                );
                if (!isDuplicate) {
                    finalWrongAnswers.push(answer);
                }
            }
        }
    }

    // If still not enough, fill with placeholder
    while (finalWrongAnswers.length < 2) {
        finalWrongAnswers.push("N/A");
    }

    // Ensure all choices are distinct before shuffling
    const allChoices = [correctAnswer, ...finalWrongAnswers];
    const distinctChoices: string[] = [correctAnswer];
    
    for (const choice of finalWrongAnswers) {
        if (isDistinct(choice, distinctChoices)) {
            distinctChoices.push(choice);
        }
    }

    // If we lost a wrong answer due to similarity, try to find a replacement
    if (distinctChoices.length < 3) {
        const used = new Set(distinctChoices.map(c => normalizeString(c)));
        for (const answer of shuffledWrong) {
            if (distinctChoices.length >= 3) break;
            const normalized = normalizeString(answer);
            if (!used.has(normalized) && normalized !== normalizeString(correctAnswer)) {
                distinctChoices.push(answer);
                used.add(normalized);
            }
        }
    }

    const choices = shuffleArray(distinctChoices);

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

// Type for quiz items (the mixed list with CTQs)
type QuizItem = {
    drug?: Drug;
    question: string;
    correct: string;
    choices: string[];
    isCriticalThinking?: boolean;
    rationale?: string;
    clinicalPearl?: string;
    medication?: string;
};

export function useQuiz(
    drugs: Drug[],
    questionCount: number = 10,
    criticalThinkingQuestions: CriticalThinkingQuestion[] = [],
    includeCriticalThinking: boolean = true,
    start?: boolean
) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const lockedQuestionsRef = useRef<QuizItem[] | null>(null);

    const questions = useMemo(() => {
        console.log("🚀 useQuiz useMemo triggered:", {
            includeCriticalThinking,
            criticalThinkingQuestionsCount: criticalThinkingQuestions.length,
            drugsCount: drugs.length,
            questionCount,
            firstCTQ: criticalThinkingQuestions[0] ? {
                id: criticalThinkingQuestions[0].id,
                scope: criticalThinkingQuestions[0].scope,
                stem: criticalThinkingQuestions[0].stem?.substring(0, 50),
            } : null,
        });
        
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

        // Filter CTQs based on includeCriticalThinking flag
        const ctqs = includeCriticalThinking
            ? criticalThinkingQuestions
            : []; // Force none if unchecked
        
        console.log("🔍 CTQ Filtering:", {
            includeCriticalThinking,
            criticalThinkingQuestionsCount: criticalThinkingQuestions.length,
            ctqsCount: ctqs.length,
            questionCount,
        });

        // First, determine how many critical thinking questions to include (50% of total for 50/50 split)
        let criticalCount = 0;
        let criticalToAdd: typeof ctqs = [];
        
        console.log("🔍 CTQ Selection:", {
            includeCriticalThinking,
            ctqsLength: ctqs.length,
            questionCount,
        });
        
        if (ctqs && ctqs.length > 0) {
            // Calculate how many critical questions to add (50% of questionCount, but not more than available)
            criticalCount = Math.min(
                Math.floor(questionCount * 0.5),
                ctqs.length
            );
            
            // Shuffle and select critical questions
            const criticalCopy = [...ctqs];
            const shuffledCritical = criticalCopy.sort(() => Math.random() - 0.5);
            criticalToAdd = shuffledCritical.slice(0, criticalCount);
            
            console.log(`✅ Will mix in ${criticalCount} critical thinking questions (50/50 split) out of ${ctqs.length} available`);
            console.log(`📋 Selected CTQ IDs:`, criticalToAdd.map(q => q.id));
            console.log(`📋 First CTQ sample:`, criticalToAdd[0] ? {
                id: criticalToAdd[0].id,
                stem: criticalToAdd[0].stem?.substring(0, 100),
                correctAnswer: criticalToAdd[0].correctAnswer,
                choicesCount: criticalToAdd[0].choices?.length,
            } : null);
        } else {
            console.error("❌ No CTQs to add:", {
                includeCriticalThinking,
                ctqsLength: ctqs.length,
                criticalThinkingQuestionsLength: criticalThinkingQuestions.length,
                criticalThinkingQuestionsSample: criticalThinkingQuestions[0] ? {
                    id: criticalThinkingQuestions[0].id,
                    scope: criticalThinkingQuestions[0].scope,
                    stem: criticalThinkingQuestions[0].stem?.substring(0, 50),
                } : null,
            });
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
        console.log(`🔄 Adding ${criticalToAdd.length} CTQs to quiz...`);
        console.log(`📝 CTQ Details:`, {
            criticalToAddLength: criticalToAdd.length,
            firstCTQ: criticalToAdd[0] ? {
                id: criticalToAdd[0].id,
                stem: criticalToAdd[0].stem?.substring(0, 50),
                hasCorrectAnswer: !!criticalToAdd[0].correctAnswer,
                correctAnswerType: typeof criticalToAdd[0].correctAnswer,
                choicesCount: criticalToAdd[0].choices?.length,
            } : null,
        });
        let addedCount = 0;
        let skippedCount = 0;
        
        criticalToAdd.forEach((ctq) => {
            // Validate the question before adding
            // Accept both string (multiple-choice) and array (select-all-that-apply) correctAnswer
            const hasValidStem = ctq.stem && 
                typeof ctq.stem === "string" &&
                ctq.stem.trim().length > 0;
            
            // Accept both string (multiple-choice) and array (select-all-that-apply) correctAnswer
            const hasValidCorrectAnswer = 
                (typeof ctq.correctAnswer === "string" && ctq.correctAnswer.trim().length > 0) ||
                (Array.isArray(ctq.correctAnswer) && ctq.correctAnswer.length > 0);
            
            const hasValidChoices = Array.isArray(ctq.choices) && 
                ctq.choices.length > 0 &&
                ctq.choices.every(c => typeof c === "string" && c.trim().length > 0);
            
            const isValid = hasValidStem && 
                hasValidCorrectAnswer && 
                hasValidChoices;
            
            if (isValid) {
                // For string answers, ensure correct answer is in choices
                if (typeof ctq.correctAnswer === "string") {
                    const correctAnswerStr = ctq.correctAnswer.trim();
                    const correctInChoices = ctq.choices.some(c => 
                        c.trim().toLowerCase() === correctAnswerStr.toLowerCase()
                    );
                    
                    if (!correctInChoices) {
                        console.warn("Critical thinking question correct answer not in choices:", {
                            id: ctq.id,
                            correctAnswer: ctq.correctAnswer,
                            choices: ctq.choices,
                        });
                    }
                }
                
                // Store correctAnswer as-is (string or array) for select-all-that-apply support
                // For now, convert array to string for compatibility with current quiz system
                // TODO: Add proper select-all-that-apply question support
                let correctAnswer: string;
                if (typeof ctq.correctAnswer === "string") {
                    correctAnswer = ctq.correctAnswer.trim();
                } else if (Array.isArray(ctq.correctAnswer)) {
                    // TypeScript type guard: ensure it's an array of strings
                    const answerArray: string[] = ctq.correctAnswer;
                    correctAnswer = answerArray.length > 0 ? answerArray.join(", ") : ""; // Convert array to comma-separated string for now
                } else {
                    correctAnswer = "";
                }
                
                // 🛑 FIX: Prevent blank first questions
                // If correctAnswer is empty after parsing, skip this CTQ
                if (!correctAnswer || correctAnswer.trim().length === 0) {
                    console.warn("⚠️ Skipping CTQ with empty correctAnswer:", ctq.id);
                    return; // Do not push this question
                }
                
                // Build choices array and ensure correct answer is included
                const choices = ctq.choices.map(c => c.trim());
                
                // If the correct answer was created from a string, ensure it's selectable
                if (typeof ctq.correctAnswer === "string") {
                    const normCorrect = ctq.correctAnswer.trim().toLowerCase();
                    const inChoices = choices.some(c => c.trim().toLowerCase() === normCorrect);
                    if (!inChoices) {
                        choices.push(ctq.correctAnswer.trim());
                    }
                }
                
                // If the correct answer was created from an array, ensure all array items are in choices
                if (Array.isArray(ctq.correctAnswer)) {
                    ctq.correctAnswer.forEach(a => {
                        const trimmedAnswer = a.trim();
                        const normAnswer = trimmedAnswer.toLowerCase();
                        const inChoices = choices.some(c => c.trim().toLowerCase() === normAnswer);
                        if (!inChoices) {
                            choices.push(trimmedAnswer);
                        }
                    });
                }
                
                // Shuffle choices to randomize position of correct answer
                const shuffledChoices = [...choices].sort(() => Math.random() - 0.5);
                
                allQuestions.push({
                    question: ctq.stem.trim(),
                    correct: correctAnswer,
                    choices: shuffledChoices,
                    isCriticalThinking: true,
                    rationale: ctq.rationale,
                    clinicalPearl: ctq.clinicalPearl,
                    medication: ctq.medication,
                });
                addedCount++;
            } else {
                skippedCount++;
                console.warn("Skipping invalid critical thinking question:", {
                    id: ctq.id,
                    hasStem: hasValidStem,
                    stemType: typeof ctq.stem,
                    stemLength: ctq.stem?.length || 0,
                    hasValidCorrectAnswer,
                    correctAnswerType: typeof ctq.correctAnswer,
                    correctAnswerIsArray: Array.isArray(ctq.correctAnswer),
                    correctAnswerLength: typeof ctq.correctAnswer === "string" 
                        ? ctq.correctAnswer.length 
                        : (Array.isArray(ctq.correctAnswer) ? (ctq.correctAnswer as string[]).length : 0),
                    hasValidChoices,
                    hasChoices: Array.isArray(ctq.choices),
                    choicesLength: ctq.choices?.length || 0,
                });
            }
        });
        
        console.log(`✅ CTQ Addition Complete: ${addedCount} added, ${skippedCount} skipped`);
        console.log(`📊 All Questions Before Shuffle:`, {
            total: allQuestions.length,
            ctqCount: allQuestions.filter(q => q.isCriticalThinking).length,
            regularCount: allQuestions.filter(q => !q.isCriticalThinking).length,
        });

        // Shuffle all questions together to mix them randomly
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const finalQuestions = shuffled;
        
        // Count critical thinking questions in final set
        const criticalInFinal = finalQuestions.filter(q => q.isCriticalThinking).length;
        const regularInFinal = finalQuestions.length - criticalInFinal;
        console.log(`📊 Quiz generated: ${finalQuestions.length} total questions (${criticalInFinal} critical thinking, ${regularInFinal} regular) - randomly mixed`);
        
        // Debug logging
        if (finalQuestions.length === 0) {
            console.warn("❌ No questions generated:", {
                drugsCount: drugs?.length || 0,
                criticalCount: ctqs?.length || 0,
                includeCriticalThinking,
                questionCount,
                allQuestionsCount: allQuestions.length,
            });
        } else if (criticalInFinal === 0 && ctqs && ctqs.length > 0 && includeCriticalThinking) {
            console.error("❌ CRITICAL: No critical thinking questions were included despite being available!", {
                ctqsLength: ctqs.length,
                criticalToAddLength: criticalToAdd.length,
                addedCount,
                skippedCount,
                includeCriticalThinking,
                allQuestionsLength: allQuestions.length,
                finalQuestionsLength: finalQuestions.length,
            });
        } else if (criticalInFinal > 0) {
            console.log(`✅ SUCCESS: ${criticalInFinal} CTQs included in quiz!`);
        }
        
        return finalQuestions;
    }, [drugs, questionCount, criticalThinkingQuestions, includeCriticalThinking]);

    // Always use current questions until locked (allows late-loaded critical thinking questions to be included)
    // Use locked questions if available, otherwise use current questions
    // IMPORTANT: questions is the result of useMemo which returns finalQuestions (the mixed list with CTQs)
    // So questions IS the final mixed list - we just need to make sure we're using it correctly
    const stableQuestions = lockedQuestionsRef.current ?? questions;
    
    // Debug: Log what we're actually using for rendering
    useEffect(() => {
        if (start) {
            const ctqCount = stableQuestions.filter(q => q.isCriticalThinking).length;
            const lockedCtqCount = lockedQuestionsRef.current?.filter(q => q.isCriticalThinking).length || 0;
            const questionsCtqCount = questions.filter(q => q.isCriticalThinking).length;
            
            console.log("🎯 UI Rendering from:", {
                source: lockedQuestionsRef.current ? "lockedQuestionsRef" : "questions (useMemo result)",
                totalQuestions: stableQuestions.length,
                ctqCount,
                regularCount: stableQuestions.length - ctqCount,
                firstQuestionIsCTQ: stableQuestions[0]?.isCriticalThinking || false,
                lockedRefCtqCount: lockedCtqCount,
                questionsArrayCtqCount: questionsCtqCount,
                isLocked: !!lockedQuestionsRef.current,
                currentIndex,
                currentQuestionIsCTQ: stableQuestions[currentIndex]?.isCriticalThinking || false,
            });
        }
    }, [start, stableQuestions, currentIndex, questions]);

    // 🔥 Always lock the fully built question list that includes CTQs
    // The questions array from useMemo already has everything mixed in when CTQs load
    // But wait a bit if CTQs are enabled to ensure they're loaded
    useEffect(() => {
        if (start) {
            // If CTQs are enabled, wait until we have CTQs actually included in the questions
            // Otherwise lock immediately
            if (!includeCriticalThinking) {
                // No CTQs, safe to lock immediately (but only if not already locked)
                if (!lockedQuestionsRef.current && questions.length > 0) {
                    lockedQuestionsRef.current = questions;
                    console.log("🔒 Questions locked (no CTQs). Total:", questions.length);
                }
            } else {
                // CTQs enabled - wait for them to be ACTUALLY included in questions
                // Check if we have CTQs in the questions array
                const ctqCount = questions.filter(q => q.isCriticalThinking).length;
                const hasCTQs = ctqCount > 0;
                const hasEnoughQuestions = questions.length >= questionCount;
                
                // If we already have a lock, check if it needs updating (CTQs were added later)
                if (lockedQuestionsRef.current) {
                    const lockedCtqCount = lockedQuestionsRef.current.filter(q => q.isCriticalThinking).length;
                    // If locked array has no CTQs but questions array now has CTQs, update the lock!
                    if (lockedCtqCount === 0 && hasCTQs && hasEnoughQuestions) {
                        lockedQuestionsRef.current = questions;
                        console.log("🔄 Lock UPDATED with CTQs! Total:", questions.length, "CTQs:", ctqCount, "Regular:", questions.length - ctqCount);
                    }
                } else {
                    // No lock yet - only lock if we have CTQs AND enough questions
                    if (hasCTQs && hasEnoughQuestions) {
                        lockedQuestionsRef.current = questions;
                        console.log("🔒 Questions locked (CTQs included). Total:", questions.length, "CTQs:", ctqCount, "Regular:", questions.length - ctqCount);
                    } else {
                        console.log("⏳ Waiting for CTQs to load before locking. Current:", {
                            totalQuestions: questions.length,
                            ctqCount,
                            hasCTQs,
                            hasEnoughQuestions,
                            expectedCount: questionCount,
                        });
                    }
                }
            }
        }
    }, [start, questions, questionCount, includeCriticalThinking]);

    // Reset quiz state when questions change (drugs or questionCount changes)
    // Only reset if questions haven't been locked yet (quiz hasn't started)
    useEffect(() => {
        // If questions are empty, don't reset (wait for them to load)
        if (questions.length === 0) return;
        
        // Only reset if we haven't locked questions yet (quiz hasn't started)
        if (!lockedQuestionsRef.current) {
            setCurrentIndex(0);
            setScore(0);
            setFinished(false);
            setAnswers([]);
        }
    }, [questions.length]);

    // Ensure we have a valid current question
    const current = stableQuestions.length > 0 && currentIndex < stableQuestions.length 
        ? stableQuestions[currentIndex] 
        : undefined;

    function selectAnswer(answer: string) {
        // Questions are already locked when start === true, but keep this as a safety check
        // IMPORTANT: Only lock if CTQs are included (if they should be)
        if (!lockedQuestionsRef.current && questions.length > 0) {
            // If CTQs should be included, verify they're actually in the array before locking
            if (includeCriticalThinking) {
                const ctqCount = questions.filter(q => q.isCriticalThinking).length;
                if (ctqCount > 0) {
                    lockedQuestionsRef.current = questions;
                    console.log("🔒 Questions locked on first answer (safety check). Total:", questions.length, "CTQs:", ctqCount);
                } else {
                    console.warn("⏳ Waiting to lock - CTQs should be included but not found yet");
                }
            } else {
                // No CTQs expected, safe to lock
                lockedQuestionsRef.current = questions;
                console.log("🔒 Questions locked on first answer (safety check, no CTQs). Total:", questions.length);
            }
        }
        
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

    // Ensure we have a valid current question - don't render if invalid
    const hasValidQuestion = current && 
        current.question && 
        typeof current.question === "string" &&
        current.question.trim().length > 0 &&
        current.choices && 
        Array.isArray(current.choices) &&
        current.choices.length > 0 &&
        current.correct && 
        typeof current.correct === "string" &&
        current.correct.trim().length > 0;

    // Debug: Log current question details
    useEffect(() => {
        if (start && current) {
            console.log("🎯 CURRENT QUESTION:", {
                index: currentIndex,
                isCriticalThinking: current.isCriticalThinking,
                hasValidQuestion,
                question: current.question?.substring(0, 50),
                hasDrug: !!current.drug,
                hasMedication: !!current.medication,
                choicesCount: current.choices?.length,
                correctAnswer: current.correct?.substring(0, 30),
            });
        }
    }, [start, currentIndex, current, hasValidQuestion]);

    // Debug: Check for invalid first question
    if (!hasValidQuestion && current) {
        console.warn("❌ INVALID QUESTION", {
            currentIndex,
            isCriticalThinking: current.isCriticalThinking,
            current,
            question: current.question,
            correct: current.correct,
            choices: current.choices,
        });
    }

    return {
        currentDrug: current?.drug,
        question: hasValidQuestion ? current.question : undefined,
        choices: hasValidQuestion ? current.choices : [],
        correctAnswer: hasValidQuestion ? current.correct : undefined,
        currentIndex,
        total: stableQuestions.length,
        selectAnswer,
        next,
        finished: finished || stableQuestions.length === 0,
        score,
        answers, // All answers for review
        hasAnswered: false, // Removed - QuizCard manages this state
        isCriticalThinking: current?.isCriticalThinking,
        rationale: current?.rationale,
        clinicalPearl: current?.clinicalPearl,
        medication: current?.medication,
    };
}
