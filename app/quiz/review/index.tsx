// app/quiz/review/index.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { QuizAnswer } from "../../../hooks/useQuiz";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { typography } from "../../../styles/typography";

export default function QuizReview() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const answersString = params.answers as string | undefined;
    const score = params.score ? parseInt(params.score as string, 10) : 0;
    const total = params.total ? parseInt(params.total as string, 10) : 0;

    const answers: QuizAnswer[] = React.useMemo(() => {
        try {
            const parsed = JSON.parse(answersString || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [answersString]);

    const correctCount = answers.filter(a => a.isCorrect).length;
    const incorrectCount = answers.filter(a => !a.isCorrect).length;

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Quiz Review</Text>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryText}>
                            Score: {score} / {total} ({Math.round((score / total) * 100)}%)
                        </Text>
                        <Text style={styles.summarySubtext}>
                            Correct: {correctCount} • Incorrect: {incorrectCount}
                        </Text>
                    </View>
                </View>

                {/* Answers List */}
                {answers.map((answer, index) => (
                    <View key={index} style={styles.answerCard}>
                        {/* Question Header */}
                        <View style={styles.questionHeader}>
                            <Text style={styles.questionNumber}>
                                Question {index + 1}
                            </Text>
                            <View style={[
                                styles.statusBadge,
                                answer.isCorrect ? styles.correctBadge : styles.incorrectBadge
                            ]}>
                                <Text style={styles.statusText}>
                                    {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                                </Text>
                            </View>
                        </View>

                        {/* Drug Name */}
                        <Text style={styles.drugName}>
                            {answer.drug.name.generic}
                        </Text>
                        {answer.drug.name.brand?.length > 0 && (
                            <Text style={styles.brandName}>
                                {answer.drug.name.brand.join(", ")}
                            </Text>
                        )}

                        {/* Question */}
                        <Text style={styles.questionText}>
                            {answer.question}
                        </Text>

                        {/* Answers */}
                        <View style={styles.answersSection}>
                            <View style={styles.answerRow}>
                                <Text style={styles.answerLabel}>Your Answer:</Text>
                                <View style={[
                                    styles.answerBox,
                                    !answer.isCorrect && styles.wrongAnswerBox
                                ]}>
                                    <Text style={styles.answerValue}>
                                        {answer.userAnswer}
                                    </Text>
                                </View>
                            </View>

                            {!answer.isCorrect && (
                                <View style={styles.answerRow}>
                                    <Text style={styles.answerLabel}>Correct Answer:</Text>
                                    <View style={[styles.answerBox, styles.correctAnswerBox]}>
                                        <Text style={styles.answerValue}>
                                            {answer.correctAnswer}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                ))}

                {/* Bottom Spacing */}
                <View style={{ height: spacing.xl }} />
            </ScrollView>

            {/* Footer Buttons */}
            <View style={styles.footer}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.lg,
        alignItems: "center",
    },
    title: {
        ...typography.h1,
        color: "#1A1A1A",
        fontWeight: "800",
        fontSize: 28,
        marginBottom: spacing.md,
        textAlign: "center",
    },
    summaryBox: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 16,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    summaryText: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    summarySubtext: {
        ...typography.body,
        color: colors.textMuted,
        fontSize: 14,
    },
    answerCard: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    questionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.sm,
    },
    questionNumber: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.textMuted,
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    correctBadge: {
        backgroundColor: "#00C98B22",
        borderWidth: 1,
        borderColor: "#00C98B",
    },
    incorrectBadge: {
        backgroundColor: "#DC354522",
        borderWidth: 1,
        borderColor: colors.danger,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    drugName: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    brandName: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    questionText: {
        ...typography.body,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        fontWeight: "600",
    },
    answersSection: {
        gap: spacing.sm,
    },
    answerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    answerLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textMuted,
        minWidth: 100,
    },
    answerBox: {
        flex: 1,
        padding: spacing.sm,
        borderRadius: 8,
        borderWidth: 1,
    },
    wrongAnswerBox: {
        backgroundColor: "#DC354522",
        borderColor: colors.danger,
    },
    correctAnswerBox: {
        backgroundColor: "#00C98B22",
        borderColor: "#00C98B",
    },
    answerValue: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    footer: {
        padding: spacing.lg,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.inputBorder,
    },
    backButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
    },
    backButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});

