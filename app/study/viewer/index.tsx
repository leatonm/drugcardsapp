import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FlashCard from "../../../components/FlashCard";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export default function FlashcardViewer() {
    const router = useRouter();
    const { data } = useLocalSearchParams();

    const drugs = JSON.parse(data as string);
    const [index, setIndex] = useState(0);

    const next = () => index < drugs.length - 1 && setIndex(index + 1);
    const prev = () => index > 0 && setIndex(index - 1);

    return (
        <View style={styles.container}>

            {/* TOP SPACER */}
            <View style={{ flex: 1 }} />

            {/* 🔽 GROUPED HEADER + CARD */}
            <View style={styles.studyBlock}>
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>STUDY MODE</Text>
                </View>

                <FlashCard drug={drugs[index]} resetFlip />
            </View>

            {/* Navigation */}
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
                    style={[
                        styles.navButton,
                        index === drugs.length - 1 && styles.disabled,
                    ]}
                    onPress={next}
                    disabled={index === drugs.length - 1}
                >
                    <Text style={styles.navButtonText}>Next</Text>
                </Pressable>
            </View>

            {/* Exit */}
            <Pressable
                style={styles.exitButton}
                onPress={() => router.replace("/study")}
            >
                <Text style={styles.exitText}>Exit Study Session</Text>
            </Pressable>

            {/* BOTTOM SPACER */}
            <View style={{ flex: 1 }} />

        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.background,
        // ⛔ remove paddingTop here
    },

    /* 🔵 STUDY MODE BANNER */
    modeBanner: {
        alignSelf: "center",
        backgroundColor: "#3D6A9F44",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,

        // ✅ THIS is the fix
        marginTop: spacing.xl,
        marginBottom: spacing.xl,
    },

    modeBannerText: {
        color: "#3D6A9F",
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

    controls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.lg,
        marginBottom: spacing.lg,
        width: "100%",
    },

    navButton: {
        backgroundColor: "#3D6A9F",
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        minWidth: 120,
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
        fontSize: 8,
        fontWeight: "700",
        color: "#3D6A9F",
        backgroundColor: "#3D6A9F22",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 14,
        minWidth: 64,
        textAlign: "center",
    },

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

