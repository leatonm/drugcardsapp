// app/quiz/random/index.tsx
import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { spacing } from "../../../styles/spacing";
import { colors } from "../../../styles/colors";
import AppHeader from "../../../components/AppHeader";

const QUESTION_COUNTS = [10, 20, 40, 50];

export default function RandomQuiz() {
    const router = useRouter();
    const { scope } = useUserScope();
    const { drugs, loading } = useDrugs(scope);
    const [questionCount, setQuestionCount] = useState<number>(10);

    if (loading) {
        return <Text style={styles.loading}>Loading...</Text>;
    }

    // Shuffle ONCE
    const randomDrugs = useMemo(() => {
        return [...drugs].sort(() => Math.random() - 0.5);
    }, [drugs]);

    const handleStart = () => {
        router.push({
            pathname: "/quiz/viewer",
            params: {
                data: JSON.stringify(randomDrugs),
                start: "true",
                questionCount: questionCount.toString(),
            },
        });
    };

    return (
        <View style={styles.container}>
            {/* 🔽 CENTERED CONTENT */}
            <View style={styles.contentWrapper}>
                <AppHeader />

                {/* 🟥 QUIZ MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>QUIZ MODE</Text>
                </View>

                <Text style={styles.title}>Random Quiz</Text>

                {/* Question Count Selector */}
                <Text style={styles.label}>Number of Questions:</Text>
                <View style={styles.questionCountContainer}>
                    {QUESTION_COUNTS.map((count) => (
                        <Pressable
                            key={count}
                            onPress={() => setQuestionCount(count)}
                            style={[
                                styles.countButton,
                                questionCount === count && styles.countButtonSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.countButtonText,
                                    questionCount === count && styles.countButtonTextSelected,
                                ]}
                            >
                                {count}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Start Quiz */}
                <Pressable
                    onPress={handleStart}
                    style={({ pressed }) => [
                        styles.startButton,
                        pressed && { transform: [{ scale: 0.97 }] },
                    ]}
                >
                    <Text style={styles.startText}>Start Quiz</Text>
                </Pressable>

                {/* Back → ALWAYS Quiz Index */}
                <Pressable
                    onPress={() => router.replace("/quiz")}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && { transform: [{ scale: 0.97 }] },
                    ]}
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
        paddingHorizontal: spacing.lg,
    },

    /* 🔑 Matches Home / Study / Quiz alignment */
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.lg,
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        textAlign: "center",
    },

    startButton: {
        width: 250,
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    startText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    backButton: {
        width: 250,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    backText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },

    loading: {
        textAlign: "center",
        marginTop: spacing.xl,
        fontSize: 16,
        color: colors.textPrimary,
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: spacing.md,
        textAlign: "center",
    },

    questionCountContainer: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.lg,
        justifyContent: "center",
        flexWrap: "wrap",
    },

    countButton: {
        minWidth: 60,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: "center",
    },

    countButtonSelected: {
        backgroundColor: colors.danger,
        borderColor: colors.danger,
    },

    countButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },

    countButtonTextSelected: {
        color: colors.buttonText,
    },
});
