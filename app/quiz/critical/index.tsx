// app/quiz/critical/index.tsx
import React, { useMemo } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import CriticalThinkingQuizCard from "../../../components/CriticalThinkingQuizCard";
import { useAuth } from "../../../hooks/useAuth";
import { useCriticalThinkingQuestions } from "../../../hooks/useCriticalThinkingQuestions";
import { useUserScope } from "../../../hooks/useUserScope";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export default function CriticalThinkingQuizViewer() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user } = useAuth();
    const { scope } = useUserScope();
    const { questions, loading } = useCriticalThinkingQuestions(scope);

    const startString = params.start as string | undefined;
    const questionCountString = params.questionCount as string | undefined;

    const start = startString === "true";
    const questionCount = questionCountString
        ? parseInt(questionCountString, 10) || 10
        : 10;

    // Check if user has premium access
    const hasAccess = user.membershipTier === "premium";

    if (!hasAccess) {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.lockedBox}>
                        <Text style={styles.lockedTitle}>
                            Premium Feature
                        </Text>
                        <Text style={styles.lockedText}>
                            Critical Thinking Questions are available for Premium
                            members only.
                        </Text>
                        <Text style={styles.lockedText}>
                            Upgrade to Premium to access this feature and unlock
                            unlimited questions, no ads, and more!
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loading}>Loading questions...</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.error}>
                        No critical thinking questions available for your
                        credential level.
                    </Text>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>
                        CRITICAL THINKING QUIZ
                    </Text>
                </View>

                <View style={styles.quizCardWrapper}>
                    <CriticalThinkingQuizCard
                        questions={questions}
                        start={start}
                        questionCount={questionCount}
                    />
                </View>
            </ScrollView>
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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
        flexGrow: 1,
        minHeight: "100%",
        justifyContent: "center",
        maxWidth: 480,
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
    },

    modeBanner: {
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.md,
    },

    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
        textAlign: "center",
    },

    quizCardWrapper: {
        width: "100%",
        alignItems: "center",
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
});

