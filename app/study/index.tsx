import { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Pressable
} from "react-native";
import { useRouter } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";
import AppHeader from "../../components/AppHeader";

// Only two options now — Scope is global
const OPTIONS = [
    { key: "all", label: "Drug Cards" },
    { key: "filtered", label: "Filtered Drug Cards" },
];

export default function StudyIndex() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={100} topSpacing={spacing.sm} />

            {/* 🟦 STUDY MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>STUDY MODE</Text>
            </View>

            <Text style={styles.subtitle}>Choose a study mode to begin</Text>

            <View style={styles.options}>
                {OPTIONS.map(opt => (
                    <Pressable
                        key={opt.key}
                        style={({ pressed }) => [
                            styles.optionButton,
                            pressed && { transform: [{ scale: 0.97 }] }, // button tap animation
                        ]}
                        onPress={() => router.push(`/study/${opt.key}`)}
                    >
                        <Text style={styles.optionButtonText}>{opt.label}</Text>
                    </Pressable>
                ))}

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.push("/home")}
                >
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        alignItems: "center",
    },


    /* 🟦 STUDY MODE BANNER */
    modeBanner: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        backgroundColor: "#3DA5D944",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        alignSelf: "center",
    },
    modeBannerText: {
        color: "#3DA5D9",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.xl,
        color: colors.textMuted,
    },

    options: {
        width: "100%",
        alignItems: "center",
    },

    /* 🔵 STUDY MODE BUTTONS */
    optionButton: {
        width: 250,
        backgroundColor: "#3DA5D9",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        alignItems: "center",
    },
    optionButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },

    backButton: {
        width: 250,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginTop: spacing.lg,
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
        textAlign: "center",
    },
});
