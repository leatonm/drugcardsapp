import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import type { Drug } from "../hooks/getDrugs";
import { useQuiz } from "../hooks/useQuiz";
import { useStatistics } from "../hooks/useStatistics";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";

interface Props {
    drugs: Drug[];
    start: boolean;
    questionCount?: number;
}

export default function QuizCard({ drugs, start, questionCount = 10 }: Props) {
    const router = useRouter();
    const quiz = useQuiz(drugs, questionCount);
    const { recordQuiz } = useStatistics();
    const [selected, setSelected] = useState<string | null>(null);
    const [statsRecorded, setStatsRecorded] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Reset quiz when starting
    useEffect(() => {
        setSelected(null);
        fadeAnim.setValue(0);
    }, [start]);

    // Reset selection and fade animation when question changes
    useEffect(() => {
        if (!start) return;
        setSelected(null);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [quiz.question, start, fadeAnim]);

    // Record statistics when quiz is finished
    useEffect(() => {
        if (quiz.finished && !statsRecorded && quiz.total > 0) {
            recordQuiz(quiz.score, quiz.total);
            setStatsRecorded(true);
        }
    }, [quiz.finished, quiz.score, quiz.total, statsRecorded, recordQuiz]);

    if (!start || !quiz || !quiz.question) return null;
    const answered = selected !== null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

            {/* EXIT BUTTON (Quiz red) */}
            <Pressable style={styles.exitButton} onPress={() => router.back()}>
                <Text style={styles.exitText}>✕</Text>
            </Pressable>

            <View style={styles.card}>

                {/* Question Counter */}
                <View style={styles.questionCounter}>
                    <Text style={styles.questionCounterText}>
                        Question {quiz.currentIndex + 1} / {quiz.total}
                    </Text>
                </View>

                {/* 🔵 DRUG NAME — now FIRST and larger */}
                <Text style={styles.drugName}>
                    {quiz.currentDrug?.name.generic ?? "N/A"}
                </Text>

                {/* Optional brand name */}
                {quiz.currentDrug?.name.brand?.length > 0 && (
                    <Text style={styles.brandName}>
                        {quiz.currentDrug.name.brand.join(", ")}
                    </Text>
                )}

                {/* Question under drug name */}
                <Text style={styles.title}>{quiz.question}</Text>

                <View style={styles.choicesBox}>
                    {quiz.choices.map((choice, index) => {
                        const isCorrect = answered && choice === quiz.correctAnswer;
                        const isWrong =
                            answered && selected === choice && choice !== quiz.correctAnswer;

                        return (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    if (!answered) {
                                        setSelected(choice);
                                        quiz.selectAnswer(choice);
                                    }
                                }}
                                style={[
                                    styles.choiceButton,
                                    isCorrect && styles.correct,
                                    isWrong && styles.wrong,
                                ]}
                            >
                                <Text style={styles.choiceText}>{choice}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* NEXT QUESTION BUTTON */}
                {answered && !quiz.finished && (
                    <Pressable
                        style={styles.nextButton}
                        onPress={() => {
                            setSelected(null);
                            quiz.next();
                        }}
                    >
                        <Text style={styles.nextText}>Next</Text>
                    </Pressable>
                )}

                {/* FINISHED */}
                {quiz.finished && (
                    <View style={styles.finishBox}>
                        <Text style={styles.finishedText}>Quiz Complete!</Text>
                        <Text style={styles.scoreText}>
                            Score: {quiz.score} / {quiz.total}
                        </Text>

                        <View style={styles.finishButtons}>
                            <Pressable
                                style={[styles.reviewButton, styles.finishButton]}
                                onPress={() => {
                                    router.push({
                                        pathname: "/quiz/review",
                                        params: {
                                            answers: JSON.stringify(quiz.answers),
                                            score: quiz.score.toString(),
                                            total: quiz.total.toString(),
                                        },
                                    });
                                }}
                            >
                                <Text style={styles.reviewButtonText}>Review</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.doneButton, styles.finishButton]}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.doneText}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>

        </Animated.View>
    );
}

/* -------------------------------------------------------------
   📚 QUIZ MODE THEME — Red Accent / Navy Card
------------------------------------------------------------- */
const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 480,       // controls width on web
        alignSelf: "center",
        padding: spacing.lg,
        alignItems: "center",
    },

    /* EXIT BUTTON (red) */
    exitButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: colors.danger,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
    },
    exitText: {
        color: "#FFF",
        fontSize: 20,
        fontWeight: "900",
    },

    /* CARD */
    card: {
        width: "100%",
        maxWidth: 480,
        backgroundColor: "#0D1B2A", // deep navy (matches FlashCard)
        padding: spacing.lg,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
    },

    title: {
        ...typography.h2,
        color: "#E0E5EB",
        textAlign: "center",
        marginBottom: spacing.md,
    },
    subtext: {
        ...typography.subtext,
        color: "#A8B3BD",
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    subtextBold: {
        color: "#E0E5EB",
        fontWeight: "700",
    },

    /* CHOICES */
    choicesBox: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    choiceButton: {
        padding: spacing.md,
        borderRadius: 16,
        backgroundColor: "#142D3C",
        borderWidth: 1,
        borderColor: "#3DA5D9", // blue border (kept)
    },
    choiceText: {
        ...typography.body,
        color: "#E0E5EB",
        fontWeight: "600",
    },

    /* CORRECT / WRONG */
    correct: {
        backgroundColor: "#00C98BAA", // green highlight
        borderColor: "#00C98B",
    },
    wrong: {
        backgroundColor: "#DC354544", // quiz red translucent
        borderColor: "#DC3545",
    },

    /* NEXT BUTTON */
    nextButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
    },
    nextText: {
        color: "#FFF",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 18,
    },

    /* FINISHED */
    finishBox: {
        marginTop: spacing.lg,
        alignItems: "center",
    },
    finishedText: {
        ...typography.h1,
        color: colors.danger,
        textAlign: "center",
    },
    scoreText: {
        ...typography.h2,
        color: "#E0E5EB",
        marginTop: spacing.sm,
    },
    finishButtons: {
        flexDirection: "row",
        gap: spacing.md,
        marginTop: spacing.lg,
        width: "100%",
    },
    finishButton: {
        flex: 1,
    },

    /* REVIEW BUTTON */
    reviewButton: {
        backgroundColor: "#3D6A9F",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
    },
    reviewButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },

    /* DONE BUTTON */
    doneButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
    },
    doneText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    drugName: {
        fontSize: 28,
        fontWeight: "900",
        textAlign: "center",
        color: "#E0E5EB",
        marginBottom: spacing.sm,
    },

    brandName: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        color: "#A8B3BD",
        marginBottom: spacing.lg,
    },

    /* Question Counter */
    questionCounter: {
        alignSelf: "center",
        backgroundColor: "#DC354544",
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: 20,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    questionCounterText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.5,
    },

});
