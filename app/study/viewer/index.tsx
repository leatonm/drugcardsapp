import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FlashCard from "../../../components/FlashCard";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { typography } from "../../../styles/typography";

export default function FlashcardViewer() {
    const router = useRouter();
    const { data } = useLocalSearchParams();

    const drugs = JSON.parse(data as string);
    const [index, setIndex] = useState(0);

    const next = () => index < drugs.length - 1 && setIndex(index + 1);
    const prev = () => index > 0 && setIndex(index - 1);

    return (
        <View style={styles.container}>

            {/* 🟦 STUDY MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>STUDY MODE</Text>
            </View>

            {/* Flashcard centered cleanly */}
            <View style={styles.centerSection}>
                <View style={styles.cardWrapper}>
                    <FlashCard drug={drugs[index]} resetFlip={true} />
                </View>
            </View>

            {/* Navigation Row */}
            <View style={styles.controls}>
                <Pressable
                    style={[styles.navButton, index === 0 && styles.disabled]}
                    onPress={prev}
                    disabled={index === 0}
                >
                    <Text style={styles.navButtonText}>Previous</Text>
                </Pressable>

                <Text style={styles.counter}>
                    {index + 1} / {drugs.length}
                </Text>

                <Pressable
                    style={[styles.navButton, index === drugs.length - 1 && styles.disabled]}
                    onPress={next}
                    disabled={index === drugs.length - 1}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                </Pressable>
            </View>

            {/* Exit */}
            <Pressable style={styles.exitButton} onPress={() => router.back()}>
                <Text style={styles.exitText}>Exit Study Session</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        backgroundColor: colors.background,
    },

    /* 🟦 STUDY MODE BANNER */
    modeBanner: {
        alignSelf: "center",
        backgroundColor: "#3DA5D944",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.xl,
    },
    modeBannerText: {
        color: "#3DA5D9",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
    },

    /* Center Flashcard vertically */
    centerSection: {
        flex: 1,
        justifyContent: "center",
    },
    cardWrapper: {
        height: 330,
        width: "100%",
        justifyContent: "center",
    },

    /* Navigation row */
    controls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.lg,          // brings buttons closer together
        marginBottom: spacing.lg,
        width: "100%",
    },


    /* 🔵 STUDY NAV BUTTONS */
    navButton: {
        backgroundColor: "#3DA5D9",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        minWidth: 120,          // keep width consistent
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    navButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    disabled: {
        opacity: 0.35,
    },

    counter: {
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "600",
    },

    /* Exit button (kept teal accent) */
    exitButton: {
        alignSelf: "center",
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        marginBottom: spacing.xl,
    },
    exitText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});
