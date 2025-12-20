// hooks/useQuiz.ts
import { useMemo, useState } from "react";
import type { Drug } from "./getDrugs";

// ---------------------
// QUESTION GENERATOR
// ---------------------

type Question = {
    question: string;
    correct: string;
    choices: string[];
};

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

    const questionTypes: string[] = [];

    if (drug.adultDose) questionTypes.push("adult");
    if (drug.pediatricDose) questionTypes.push("pediatric");

    questionTypes.push("class", "indication", "contra", "mechanism");

    if (drug.interactions?.length) questionTypes.push("interaction");
    if (drug.education?.length) questionTypes.push("education");

    if (questionTypes.length === 0) {
        return null;
    }

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

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

    // Generate wrong answers with safety limit to prevent infinite loop
    const wrongAnswers = new Set<string>();
    const maxAttempts = 200;
    let attempts = 0;

    while (wrongAnswers.size < 2 && attempts < maxAttempts) {
        attempts++;
        const rand = allDrugs[Math.floor(Math.random() * allDrugs.length)];
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
            wrongAnswers.add(wrong);
        }
    }

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

export function useQuiz(drugs: Drug[], questionCount: number = 10) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    const questions = useMemo(() => {
        if (!drugs || drugs.length === 0) {
            return [];
        }

        // Shuffle drugs first to randomize question selection
        const shuffledDrugs = shuffleArray([...drugs]);

        const allQuestions = shuffledDrugs
            .map((drug) => {
                const question = generateQuestion(drug, drugs);
                if (!question) return null;
                return {
                    drug,
                    ...question,
                };
            })
            .filter((q): q is NonNullable<typeof q> => q !== null);

        // Limit to the requested question count
        return allQuestions.slice(0, questionCount);
    }, [drugs, questionCount]);

    const current = questions[currentIndex];

    function selectAnswer(answer: string) {
        // Prevent multiple selections
        if (selectedAnswer !== null) {
            return;
        }

        setSelectedAnswer(answer);
        if (answer === current?.correct) {
            setScore((s) => s + 1);
        }
    }

    function next() {
        if (currentIndex + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
            setSelectedAnswer(null); // Reset selection for next question
        }
    }

    return {
        currentDrug: current?.drug,
        question: current?.question,
        choices: current?.choices,
        correctAnswer: current?.correct,
        currentIndex,
        total: questions.length,
        selectAnswer,
        next,
        finished,
        score,
        selectedAnswer,
        hasAnswered: selectedAnswer !== null,
    };
}
