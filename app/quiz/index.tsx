// app/quiz/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

export default function QuizHome() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <View style={styles.container}>
            {/* 🔽 CENTERED CONTENT BLOCK */}
            <View style={styles.contentWrapper}>
                <AppHeader />

                {/* 🟥 QUIZ MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>QUIZ MODE</Text>
                </View>

                <Text style={styles.subtitle}>
                    Choose a quiz mode to begin
                </Text>

                <View style={styles.options}>
                    <Pressable
                        style={styles.quizButton}
                        onPress={() => router.push("/quiz/random")}
                    >
                        <Text style={styles.quizButtonText}>Quiz</Text>
                        <Text style={styles.buttonSubtext}>Random Questions</Text>
                    </Pressable>

                    <Pressable
                        style={styles.quizButton}
                        onPress={() => router.push("/quiz/filtered")}
                    >
                        <Text style={styles.quizButtonText}>Filtered Quiz</Text>
                        <Text style={styles.buttonSubtext}>Test by Category</Text>
                    </Pressable>

                    {/* Back → ALWAYS HOME */}
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.replace("/home")}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    /* 🔑 Matches Home / Study alignment */
    contentWrapper: {
        flex: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
        justifyContent: "center",
    },

    /* 🟥 QUIZ MODE BANNER */
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
        ...typography.h2,
        textAlign: "center",
        marginBottom: spacing.lg,
        color: colors.textMuted,
    },

    options: {
        width: "100%",
        gap: spacing.sm,
        marginBottom: spacing.md,
    },

    /* 🟥 QUIZ BUTTONS */
    quizButton: {
        backgroundColor: colors.danger,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    quizButtonText: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.buttonText,
        marginBottom: 2,
    },
    buttonSubtext: {
        fontSize: 12,
        color: colors.buttonText,
        opacity: 0.9,
        fontWeight: "500",
    },

    /* Back */
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

    premiumButton: {
        borderWidth: 2,
        borderColor: colors.accent,
    },
});
