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
    const questionTypes: string[] = [];

    if (drug.adultDose) questionTypes.push("adult");
    if (drug.pediatricDose) questionTypes.push("pediatric");

    questionTypes.push("class", "indication", "contra", "mechanism");

    if (drug.interactions?.length) questionTypes.push("interaction");
    if (drug.education?.length) questionTypes.push("education");

    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let questionText = "";
    let correctAnswer = "";

    switch (type) {
        case "adult":
            questionText = "What is the adult dosage?";
            correctAnswer = drug.adultDose!;
            break;

        case "pediatric":
            questionText = "What is the pediatric dosage?";
            correctAnswer = drug.pediatricDose!;
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
            questionText = "Which of these is an indication?";
            correctAnswer =
                drug.indications[Math.floor(Math.random() * drug.indications.length)];
            break;

        case "contra":
            questionText = "Which of these is a contraindication?";
            correctAnswer =
                drug.contraindications[Math.floor(Math.random() * drug.contraindications.length)];
            break;

        case "interaction":
            questionText = "Which of these is a drug interaction?";
            correctAnswer =
                drug.interactions![Math.floor(Math.random() * drug.interactions!.length)];
            break;

        case "education":
            questionText = "Which is appropriate patient education?";
            correctAnswer =
                drug.education![Math.floor(Math.random() * drug.education!.length)];
            break;
    }

    //Guaranteed unique answers
    const wrongAnswers = new Set<string>();

    while (wrongAnswers.size < 2) {
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
                wrong = rand.class;
                break;
            case "mechanism":
                wrong = rand.mechanism;
                break;
            case "indication":
                wrong = rand.indications?.[0] ?? "";
                break;
            case "contra":
                wrong = rand.contraindications?.[0] ?? "";
                break;
            case "interaction":
                wrong = rand.interactions?.[0] ?? "";
                break;
            case "education":
                wrong = rand.education?.[0] ?? "";
                break;
        }

        if (wrong && wrong !== correctAnswer) {
            wrongAnswers.add(wrong);
        }
    }

    const choices = [...wrongAnswers, correctAnswer].sort(
        () => Math.random() - 0.5
    );

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
