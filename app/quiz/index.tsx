// app/quiz/index.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../../components/AppHeader";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

export default function QuizHome() {
    const router = useRouter();

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
                    {/* Random Quiz */}
                    <Pressable
                        onPress={() => router.push("/quiz/random")}
                        style={({ pressed }) => [
                            styles.quizButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.quizButtonText}>Quiz</Text>
                    </Pressable>

                    {/* Filtered Quiz */}
                    <Pressable
                        onPress={() => router.push("/quiz/filtered")}
                        style={({ pressed }) => [
                            styles.quizButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Text style={styles.quizButtonText}>
                            Filtered Quiz
                        </Text>
                    </Pressable>

                    {/* Assigned Quiz */}
                    <Pressable
                        onPress={() => router.push("/quiz/assigned")}
                        style={({ pressed }) => [
                            styles.textLink,
                            pressed && { opacity: 0.6 },
                        ]}
                    >
                        <Text style={styles.textLinkText}>
                            Assigned Quiz
                        </Text>
                    </Pressable>

                    {/* Back → ALWAYS HOME */}
                    <Pressable
                        onPress={() => router.replace("/home")}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressedBack,
                        ]}
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
        paddingHorizontal: spacing.lg,
    },

    /* 🔑 Matches Home / Study alignment */
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120, // keeps visual balance
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
        alignItems: "center",
    },

    /* 🟥 QUIZ BUTTONS */
    quizButton: {
        width: 250,
        backgroundColor: "#DC3545",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    quizButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    pressed: {
        transform: [{ scale: 0.97 }],
        shadowOpacity: 0.05,
    },

    /* Assigned Quiz link */
    textLink: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },
    textLinkText: {
        color: colors.accent,
        textDecorationLine: "underline",
        fontSize: 15,
        fontWeight: "600",
    },

    /* Back */
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
    pressedBack: {
        transform: [{ scale: 0.97 }],
        shadowOpacity: 0.05,
    },
    backText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },
});
