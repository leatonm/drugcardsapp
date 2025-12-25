// app/quiz/viewer/index.tsx
import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuizCard from "../../../components/QuizCard";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export default function QuizViewer() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const dataString = params.data as string | undefined;
    const startString = params.start as string | undefined;
    const questionCountString = params.questionCount as string | undefined;
    const includeCriticalThinkingString = params.includeCriticalThinking as string | undefined;

    const start = startString === "true";
    const questionCount = questionCountString 
        ? parseInt(questionCountString, 10) || 10 
        : 10;
    const includeCriticalThinking = includeCriticalThinkingString === "true";

    const drugs = useMemo(() => {
        try {
            const parsed = JSON.parse(dataString || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [dataString]);

    const finalDrugs = useMemo(() => {
        if (!start) return drugs;

        const arr = [...drugs];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [drugs, start]);

    /* ❌ No data fallback */
    if (!drugs.length) {
        return (
            <View style={styles.container}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.error}>No drug data provided.</Text>

                    <Pressable
                        onPress={() => router.replace("/quiz")}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>
                            Back to Quiz Menu
                        </Text>
                    </Pressable>
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
                {/* 🟥 QUIZ MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>QUIZ MODE</Text>
                </View>

                {/* Quiz Engine - Centered */}
                <View style={styles.quizCardWrapper}>
                    <QuizCard 
                        drugs={finalDrugs} 
                        start={start} 
                        questionCount={questionCount}
                        includeCriticalThinking={includeCriticalThinking}
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
        paddingBottom: spacing.lg,
        flexGrow: 1,
        minHeight: "100%",
        justifyContent: "center",
        maxWidth: 480,
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.md,
    },

    quizCardWrapper: {
        width: "100%",
        alignItems: "center",
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
    },

    error: {
        color: colors.textPrimary,
        fontSize: 18,
        marginVertical: spacing.lg,
        textAlign: "center",
    },

    backButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        marginTop: spacing.lg,
    },
    backButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});
