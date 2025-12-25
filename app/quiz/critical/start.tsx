// app/quiz/critical/start.tsx
import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../../../components/AppHeader";
import { useAuth } from "../../../hooks/useAuth";
import { useCriticalThinkingQuestions } from "../../../hooks/useCriticalThinkingQuestions";
import { useUserScope } from "../../../hooks/useUserScope";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

const QUESTION_COUNTS = [10, 20, 30, 40, 50];

export default function CriticalThinkingQuizStart() {
    const router = useRouter();
    const { user } = useAuth();
    const { scope } = useUserScope();
    const { questions, loading } = useCriticalThinkingQuestions(scope);
    const [questionCount, setQuestionCount] = useState<number>(10);

    // Check if user has premium access
    const hasAccess = user.membershipTier === "premium";

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading questions...</Text>
            </View>
        );
    }

    if (!hasAccess) {
        return (
            <View style={styles.container}>
                <View style={styles.contentWrapper}>
                    <AppHeader />
                    <View style={styles.lockedBox}>
                        <Text style={styles.lockedTitle}>Premium Feature</Text>
                        <Text style={styles.lockedText}>
                            Critical Thinking Questions are available for Premium
                            members only.
                        </Text>
                        <Text style={styles.lockedText}>
                            Upgrade to Premium to access this feature!
                        </Text>
                        <Pressable
                            style={styles.upgradeButton}
                            onPress={() => router.push("/home")}
                        >
                            <Text style={styles.upgradeButtonText}>
                                View Premium Features
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.container}>
                <View style={styles.contentWrapper}>
                    <AppHeader />
                    <Text style={styles.error}>
                        No critical thinking questions available for your
                        credential level.
                    </Text>
                </View>
            </View>
        );
    }

    const handleStart = () => {
        router.push({
            pathname: "/quiz/critical",
            params: {
                start: "true",
                questionCount: questionCount.toString(),
            },
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <AppHeader />

                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>
                        CRITICAL THINKING QUIZ
                    </Text>
                </View>

                <Text style={styles.subtitle}>
                    Test your clinical reasoning with scenario-based questions
                </Text>

                <Text style={styles.availableText}>
                    {questions.length} questions available
                </Text>

                <View style={styles.questionCountSection}>
                    <Text style={styles.questionCountLabel}>
                        Number of Questions:
                    </Text>
                    <View style={styles.questionCountButtons}>
                        {QUESTION_COUNTS.map((count) => (
                            <Pressable
                                key={count}
                                style={[
                                    styles.questionCountButton,
                                    questionCount === count &&
                                        styles.questionCountButtonActive,
                                    count > questions.length &&
                                        styles.questionCountButtonDisabled,
                                ]}
                                onPress={() => {
                                    if (count <= questions.length) {
                                        setQuestionCount(count);
                                    }
                                }}
                                disabled={count > questions.length}
                            >
                                <Text
                                    style={[
                                        styles.questionCountButtonText,
                                        questionCount === count &&
                                            styles.questionCountButtonTextActive,
                                        count > questions.length &&
                                            styles.questionCountButtonTextDisabled,
                                    ]}
                                >
                                    {count}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <Pressable style={styles.startButton} onPress={handleStart}>
                    <Text style={styles.startButtonText}>Start Quiz</Text>
                </Pressable>

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/quiz")}
                >
                    <Text style={styles.backText}>Back</Text>
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

    contentWrapper: {
        flex: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
        justifyContent: "center",
    },

    modeBanner: {
        marginBottom: spacing.lg,
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.1,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted,
    },

    availableText: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: spacing.lg,
        color: colors.textMuted,
        fontStyle: "italic",
    },

    questionCountSection: {
        marginBottom: spacing.lg,
    },

    questionCountLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: "center",
    },

    questionCountButtons: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        justifyContent: "center",
    },

    questionCountButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.inputBorder,
        minWidth: 60,
    },

    questionCountButtonActive: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
    },

    questionCountButtonDisabled: {
        opacity: 0.4,
    },

    questionCountButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textPrimary,
        textAlign: "center",
    },

    questionCountButtonTextActive: {
        color: "#FFF",
        fontWeight: "700",
    },

    questionCountButtonTextDisabled: {
        color: colors.textMuted,
    },

    startButton: {
        backgroundColor: colors.danger,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: spacing.sm,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    startButtonText: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.buttonText,
    },

    backButton: {
        backgroundColor: colors.accent,
        padding: spacing.md,
        borderRadius: 16,
        marginTop: spacing.sm,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    backText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    loading: {
        color: colors.textPrimary,
        fontSize: 18,
        textAlign: "center",
        marginTop: spacing.xl,
    },

    error: {
        color: colors.textPrimary,
        fontSize: 18,
        marginVertical: spacing.lg,
        textAlign: "center",
    },

    lockedBox: {
        backgroundColor: colors.card,
        padding: spacing.lg,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: "center",
    },

    lockedTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },

    lockedText: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: "center",
        marginBottom: spacing.sm,
        lineHeight: 24,
    },

    upgradeButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        marginTop: spacing.md,
    },

    upgradeButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});

