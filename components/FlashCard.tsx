import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from "react-native-reanimated";
import { spacing } from "../styles/spacing";
import type { Drug } from "../hooks/getDrugs";

/* -------------------------------------------------
   🎨 Color Theme
------------------------------------------------- */
const cardColors = {
    card: "#0D1B2A",          // Deep navy
    textPrimary: "#E0E5EB",   // Soft off-white
    textMuted: "#A8B3BD",
    accent: "#00D1C1",        // Teal accent
};

/* -------------------------------------------------
   🛟 Safe display helper
------------------------------------------------- */
function safe(value: any): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string" || typeof value === "number") return String(value);
    return Object.values(value).join(", ");
}

/* -------------------------------------------------
   🏥 Detect RN-style drug (no dosing, has education)
------------------------------------------------- */
function isRnStyleDrug(drug: Drug) {
    return (
        Array.isArray(drug.interactions) ||
        Array.isArray(drug.education)
    );
}

/* -------------------------------------------------
   💳 FlashCard Component
------------------------------------------------- */
type FlashCardProps = {
    drug: Drug;
    resetFlip?: boolean;
};

export default function FlashCard({ drug, resetFlip = false }: FlashCardProps) {
    const rotation = useSharedValue(0);

    useEffect(() => {
        if (resetFlip) rotation.value = withSpring(0);
    }, [drug.id]);

    const flipCard = () => {
        rotation.value = withSpring(rotation.value === 0 ? 180 : 0);
    };

    const frontStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value}deg` }],
        opacity: rotation.value < 90 ? 1 : 0,
    }));

    const backStyle = useAnimatedStyle(() => ({
        transform: [{ rotateY: `${rotation.value + 180}deg` }],
        opacity: rotation.value >= 90 ? 1 : 0,
    }));

    return (
        <Pressable onPress={flipCard}>
            <View style={styles.container}>

                {/* ---------- FRONT ---------- */}
                <Animated.View style={[styles.absoluteCard, frontStyle]}>
                    <View style={styles.card}>
                        <View style={styles.frontCenter}>

                            <Text style={styles.generic}>
                                {safe(drug.name?.generic)}
                            </Text>

                            {!!drug.name?.brand?.length && (
                                <Text style={styles.brand}>
                                    {safe(drug.name.brand)}
                                </Text>
                            )}

                            <Text style={styles.classText}>
                                {safe(drug.class)}
                            </Text>
                        </View>

                        <Text style={styles.tapText}>Tap to flip</Text>
                    </View>
                </Animated.View>

                {/* ---------- BACK ---------- */}
                <Animated.View style={[styles.absoluteCard, backStyle]}>
                    <View style={styles.card}>
                        <ScrollView style={{ flex: 1 }}
    contentContainerStyle={{
        paddingRight: spacing.xl,
        paddingBottom: spacing.lg,
    }}
    showsVerticalScrollIndicator
    indicatorStyle="white"
>


                            <Text style={styles.detail}>
                                <Text style={styles.label}>Mechanism:</Text>{" "}
                                {safe(drug.mechanism)}
                            </Text>

                            <Text style={styles.detail}>
                                <Text style={styles.label}>Indications:</Text>{" "}
                                {safe(drug.indications)}
                            </Text>

                            <Text style={styles.detail}>
                                <Text style={styles.label}>Contraindications:</Text>{" "}
                                {safe(drug.contraindications)}
                            </Text>

                            {/* 🚑 PREHOSPITAL / FIELD DRUGS */}
                            {!isRnStyleDrug(drug) && (
                                <>
                                    {drug.adultDose && (
                                        <Text style={styles.detail}>
                                            <Text style={styles.label}>Adult Dose:</Text>{" "}
                                            {drug.adultDose}
                                        </Text>
                                    )}

                                    {drug.pediatricDose && (
                                        <Text style={styles.detail}>
                                            <Text style={styles.label}>Pediatric Dose:</Text>{" "}
                                            {drug.pediatricDose}
                                        </Text>
                                    )}

                                    {drug.routes?.length > 0 && (
                                        <Text style={styles.detail}>
                                            <Text style={styles.label}>Routes:</Text>{" "}
                                            {safe(drug.routes)}
                                        </Text>
                                    )}
                                </>
                            )}

                            {/* 🏥 RN / IN-HOSPITAL DRUGS */}
                            {isRnStyleDrug(drug) && (
                                <>
                                    {drug.interactions?.length > 0 && (
                                        <Text style={styles.detail}>
                                            <Text style={styles.label}>Interactions:</Text>{" "}
                                            {safe(drug.interactions)}
                                        </Text>
                                    )}

                                    {drug.education?.length > 0 && (
                                        <Text style={styles.detail}>
                                            <Text style={styles.label}>Patient Education:</Text>{" "}
                                            {safe(drug.education)}
                                        </Text>
                                    )}
                                </>
                            )}

                        </ScrollView>
                    </View>
                </Animated.View>

            </View>
        </Pressable>
    );
}

/* -------------------------------------------------
   🎨 Styles
------------------------------------------------- */
const styles = StyleSheet.create({
    container: {
        width: "100%",
        maxWidth: 420,
        height: 360,
        alignSelf: "center",
        marginBottom: spacing.xl,
        perspective: 1200,
    },

    absoluteCard: {
        position: "absolute",
        inset: 0,
    },

    card: {
        flex: 1,
        borderRadius: 24,
        padding: spacing.lg,
        backgroundColor: cardColors.card,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 7,
    },

    frontCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },

    generic: {
        fontSize: 34,
        fontWeight: "900",
        textAlign: "center",
        color: cardColors.textPrimary,
        marginBottom: spacing.sm,
    },

    brand: {
        fontSize: 20,
        fontWeight: "500",
        textAlign: "center",
        color: cardColors.textMuted,
        marginBottom: spacing.md,
    },

    classText: {
        fontSize: 18,
        textAlign: "center",
        color: cardColors.textMuted,
    },

    tapText: {
        textAlign: "center",
        color: cardColors.accent,
        fontSize: 14,
        marginTop: spacing.md,
        opacity: 0.9,
    },

    label: {
        fontWeight: "700",
        color: cardColors.accent,
        fontSize: 16,
    },

    detail: {
        fontSize: 16,
        lineHeight: 22,
        color: cardColors.textPrimary,
        marginBottom: spacing.md,
    },
});
