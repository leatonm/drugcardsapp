import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuizCard from "../../../components/QuizCard";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import AppHeader from "../../../components/AppHeader";

export default function QuizViewer() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const dataString = params.data as string | undefined;
    const startString = params.start as string | undefined;

    // Convert "true"/"false" string into real boolean
    const start = startString === "true";

    // Parse array safely
    const drugs = useMemo(() => {
        try {
            const parsed = JSON.parse(dataString || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, [dataString]);

    // Shuffle only ONCE and only when start=true
    const finalDrugs = useMemo(() => {
        if (!start) return drugs; // keep order for non-random future modes

        const arr = [...drugs];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [drugs, start]);

    // If nothing was passed into viewer, show error
    if (!drugs.length) {
        return (
            <View style={styles.container}>
                <AppHeader logoHeight={90} topSpacing={spacing.sm} />
                <Text style={styles.error}>No drug data provided.</Text>

                <Pressable
                    onPress={() => router.push("/quiz")}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Back to Quiz Menu</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={90} topSpacing={spacing.sm} />

            {/* 🟥 QUIZ MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>QUIZ MODE</Text>
            </View>

            {/* spacing before card */}
            <View style={{ height: spacing.md }} />

            {/* Quiz Engine */}
            <QuizCard drugs={finalDrugs} start={start} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        alignSelf: "center",
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginTop: spacing.sm,
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
        alignSelf: "center",
        marginTop: spacing.lg,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16
    },
    backButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700"
    },
});
