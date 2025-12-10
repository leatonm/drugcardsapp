import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { spacing } from "../../../styles/spacing";
import { colors } from "../../../styles/colors";
import AppHeader from "../../../components/AppHeader";

export default function RandomQuiz() {
    const router = useRouter();
    const { scope } = useUserScope();                // ✅ get selected level
    const { drugs, loading } = useDrugs(scope);      // ✅ filter meds by scope

    if (loading) return <Text style={styles.loading}>Loading...</Text>;

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
            },
        });
    };

    return (
        <View style={styles.container}>
            <AppHeader topSpacing={spacing.sm} logoHeight={100} />

            {/* 🟥 QUIZ MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>QUIZ MODE</Text>
            </View>

            <Text style={styles.title}>Random Quiz</Text>

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

            {/* Back */}
            <Pressable
                onPress={() => router.push("/quiz")}
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && { transform: [{ scale: 0.97 }] },
                ]}
            >
                <Text style={styles.backText}>Back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        marginBottom: spacing.lg,
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        alignSelf: "center",
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
        marginBottom: spacing.lg,
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
});
