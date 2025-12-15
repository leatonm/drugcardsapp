// hooks/useQuiz.ts
import { useState, useMemo } from "react";
import type { Drug } from "./getDrugs";

// ---------------------
// QUESTION GENERATOR
// ---------------------

type Question = {
    question: string;
    correct: string;
    choices: string[];
};

function generateQuestion(drug: Drug, allDrugs: Drug[]): Question {
    const questionTypes = ["adult", "pediatric", "class", "indication", "contra"];
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let questionText = "";
    let correctAnswer = "";

    switch (type) {
        case "adult":
            questionText = "What is the adult dosage?";
            correctAnswer = drug.adultDose || "N/A";
            break;

        case "pediatric":
            questionText = "What is the pediatric dosage?";
            correctAnswer = drug.pediatricDose || "N/A";
            break;

        case "class":
            questionText = "What is the drug class?";
            correctAnswer = drug.class || "N/A";
            break;

        case "indication":
            questionText = "Which of these is an indication?";
            correctAnswer =
                drug.indications?.[Math.floor(Math.random() * drug.indications.length)] ||
                "N/A";
            break;

        case "contra":
            questionText = "Which of these is a contraindication?";
            correctAnswer =
                drug.contraindications?.[Math.floor(Math.random() * drug.contraindications.length)] ||
                "N/A";
            break;
    }

    // Build wrong answers
    const wrongAnswers: string[] = [];

    for (let i = 0; i < allDrugs.length && wrongAnswers.length < 2; i++) {
        const rand = allDrugs[Math.floor(Math.random() * allDrugs.length)];
        let wrong = "";

        switch (type) {
            case "adult":
                wrong = rand.adultDose;
                break;

            case "pediatric":
                wrong = rand.pediatricDose;
                break;

            case "class":
                wrong = rand.class;
                break;

            case "indication":
                wrong = rand.indications?.[Math.floor(Math.random() * rand.indications.length)];
                break;

            case "contra":
                wrong = rand.contraindications?.[Math.floor(Math.random() * rand.contraindications.length)];
                break;
        }

        if (
            wrong &&
            wrong !== correctAnswer &&
            !wrongAnswers.includes(wrong) &&
            wrong.length > 0
        ) {
            wrongAnswers.push(wrong);
        }
    }

    // ⛑ Ensure 2 wrong answers ALWAYS exist
    while (wrongAnswers.length < 2) {
        wrongAnswers.push("Not applicable");
    }

    const choices = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);

    return {
        question: questionText,
        correct: correctAnswer,
        choices,
    };
}

// ---------------------
// QUIZ HOOK
// ---------------------

export function useQuiz(drugs: Drug[]) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const questions = useMemo(() => {
        return drugs.map((drug) => ({
            drug,
            ...generateQuestion(drug, drugs),
        }));
    }, [drugs]);

    const current = questions[currentIndex];

    function selectAnswer(answer: string) {
        if (answer === current.correct) {
            setScore((s) => s + 1);
        }
    }

    function next() {
        if (currentIndex + 1 >= questions.length) {
            setFinished(true);
        } else {
            setCurrentIndex((i) => i + 1);
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
    };
}
