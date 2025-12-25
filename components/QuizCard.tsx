import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import type { Drug } from "../hooks/getDrugs";
import { useCriticalThinkingQuestions } from "../hooks/useCriticalThinkingQuestions";
import { useQuiz } from "../hooks/useQuiz";
import { useStatistics } from "../hooks/useStatistics";
import { useUserScope } from "../hooks/useUserScope";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { typography } from "../styles/typography";

interface Props {
    drugs: Drug[];
    start: boolean;
    questionCount?: number;
    includeCriticalThinking?: boolean;
}

export default function QuizCard({ drugs, start, questionCount = 10, includeCriticalThinking = false }: Props) {
    const router = useRouter();
    const { scope } = useUserScope();
    const { questions: criticalQuestions } = useCriticalThinkingQuestions(scope);
    const quiz = useQuiz(drugs, questionCount, includeCriticalThinking ? criticalQuestions : []);
    const { recordQuiz } = useStatistics();
    const [selected, setSelected] = useState<string | null>(null);
    const [statsRecorded, setStatsRecorded] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Reset quiz when starting
    useEffect(() => {
        setSelected(null);
        setShowRationale(false);
        fadeAnim.setValue(0);
    }, [start]);

    // Reset selection and fade animation when question changes
    useEffect(() => {
        if (!start) return;
        setSelected(null);
        setShowRationale(false);
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
            <Pressable style={styles.exitButton} onPress={() => router.replace("/quiz")}>
                <Text style={styles.exitText}>✕</Text>
            </Pressable>

            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {/* Question Counter */}
                    <View style={styles.questionCounter}>
                        <Text style={styles.questionCounterText}>
                            Question {quiz.currentIndex + 1} / {quiz.total}
                        </Text>
                    </View>

                    {/* 🔵 DRUG/MEDICATION NAME — now FIRST and larger */}
                    {quiz.isCriticalThinking ? (
                        <Text style={styles.drugName}>
                            {quiz.medication ?? "N/A"}
                        </Text>
                    ) : (
                        <>
                            <Text style={styles.drugName}>
                                {quiz.currentDrug?.name.generic ?? "N/A"}
                            </Text>
                            {/* Optional brand name */}
                            {quiz.currentDrug?.name.brand?.length > 0 && (
                                <Text style={styles.brandName}>
                                    {quiz.currentDrug.name.brand.join(", ")}
                                </Text>
                            )}
                        </>
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
                                            if (quiz.isCriticalThinking) {
                                                setShowRationale(true);
                                            }
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

                    {/* Rationale and Clinical Pearl for Critical Thinking Questions */}
                    {answered && showRationale && quiz.isCriticalThinking && (
                        <View style={styles.feedbackBox}>
                            <Text style={styles.rationaleTitle}>Rationale:</Text>
                            <Text style={styles.rationaleText}>
                                {quiz.rationale}
                            </Text>
                            <Text style={styles.pearlTitle}>Clinical Pearl:</Text>
                            <Text style={styles.pearlText}>
                                {quiz.clinicalPearl}
                            </Text>
                        </View>
                    )}
                </View>

                {/* NEXT QUESTION BUTTON */}
                {answered && !quiz.finished && (
                    <Pressable
                        style={styles.nextButton}
                        onPress={() => {
                            setSelected(null);
                            setShowRationale(false);
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
                                onPress={() => router.replace("/quiz")}
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
        padding: spacing.md,
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
        padding: spacing.md,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(220, 53, 69, 0.2)", // subtle red border to match quiz theme
        justifyContent: "space-between",
        minHeight: 400,
    },

    cardContent: {
        flex: 1,
        justifyContent: "center",
    },

    title: {
        ...typography.h2,
        color: "#E0E5EB",
        textAlign: "center",
        marginBottom: spacing.md,
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 24,
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
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    choiceButton: {
        padding: spacing.md,
        borderRadius: 16,
        backgroundColor: "rgba(220, 53, 69, 0.08)",
        borderWidth: 2,
        borderColor: "rgba(220, 53, 69, 0.3)",
        borderLeftWidth: 3,
        borderLeftColor: colors.danger,
    },
    choiceText: {
        ...typography.body,
        color: "#E0E5EB",
        fontWeight: "600",
        fontSize: 16,
        lineHeight: 22,
    },

    /* CORRECT / WRONG */
    correct: {
        backgroundColor: "rgba(0, 201, 139, 0.15)", // green highlight
        borderColor: "#00C98B",
        borderLeftColor: "#00C98B",
    },
    wrong: {
        backgroundColor: "rgba(220, 53, 69, 0.15)", // quiz red translucent
        borderColor: "#DC3545",
        borderLeftColor: "#DC3545",
    },

    /* NEXT BUTTON */
    nextButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
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
        marginBottom: spacing.xs,
        letterSpacing: 0.5,
    },

    brandName: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        color: "#A8B3BD",
        marginBottom: spacing.sm,
        fontStyle: "italic",
    },

    /* Question Counter */
    questionCounter: {
        alignSelf: "center",
        backgroundColor: "rgba(220, 53, 69, 0.15)",
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

    feedbackBox: {
        backgroundColor: "rgba(61, 106, 159, 0.1)",
        borderRadius: 12,
        padding: spacing.md,
        marginTop: spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
    },
    rationaleTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.accent,
        marginBottom: spacing.xs,
    },
    rationaleText: {
        fontSize: 13,
        color: "#E0E5EB",
        lineHeight: 20,
        marginBottom: spacing.sm,
    },
    pearlTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.accent,
        marginBottom: spacing.xs,
    },
    pearlText: {
        fontSize: 13,
        color: "#E0E5EB",
        lineHeight: 20,
    },
});
