import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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
    accent: "#3D6A9F",        // Medium blue accent (matching logo navy theme)
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
                        <View style={styles.backContent}>
                            <View style={styles.sectionsContainer}>
                                {/* Mechanism Section */}
                                <View style={styles.contentBlock}>
                                    <Text style={styles.sectionTitle}>Mechanism</Text>
                                    <Text style={styles.sectionContent}>
                                        {safe(drug.mechanism)}
                                    </Text>
                                </View>

                                {/* Indications Section */}
                                <View style={styles.contentBlock}>
                                    <Text style={styles.sectionTitle}>Indications</Text>
                                    <Text style={styles.sectionContent}>
                                        {safe(drug.indications)}
                                    </Text>
                                </View>

                                {/* Contraindications Section */}
                                <View style={styles.contentBlock}>
                                    <Text style={styles.sectionTitle}>Contraindications</Text>
                                    <Text style={styles.sectionContent}>
                                        {safe(drug.contraindications)}
                                    </Text>
                                </View>

                            {/* 🚑 PREHOSPITAL / FIELD DRUGS */}
                            {!isRnStyleDrug(drug) && (
                                <>
                                    {/* Adult Dose, Pediatric Dose, and Routes in one row */}
                                    {(drug.adultDose || drug.pediatricDose || drug.routes?.length > 0) && (
                                        <View style={styles.dosageRow}>
                                            {drug.adultDose && (
                                                <View style={styles.dosageBlock}>
                                                    <Text style={styles.sectionTitle}>Adult Dose</Text>
                                                    <Text style={styles.sectionContent}>
                                                        {drug.adultDose}
                                                    </Text>
                                                </View>
                                            )}

                                            {drug.pediatricDose && (
                                                <View style={styles.dosageBlock}>
                                                    <Text style={styles.sectionTitle}>Pediatric Dose</Text>
                                                    <Text style={styles.sectionContent}>
                                                        {drug.pediatricDose}
                                                    </Text>
                                                </View>
                                            )}

                                            {drug.routes?.length > 0 && (
                                                <View style={styles.dosageBlock}>
                                                    <Text style={styles.sectionTitle}>Routes</Text>
                                                    <Text style={styles.sectionContent}>
                                                        {safe(drug.routes)}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </>
                            )}

                                {/* 🏥 RN / IN-HOSPITAL DRUGS */}
                                {isRnStyleDrug(drug) && (
                                    <>
                                        {drug.interactions?.length > 0 && (
                                            <View style={styles.contentBlock}>
                                                <Text style={styles.sectionTitle}>Interactions</Text>
                                                <Text style={styles.sectionContent}>
                                                    {safe(drug.interactions)}
                                                </Text>
                                            </View>
                                        )}

                                        {drug.education?.length > 0 && (
                                            <View style={styles.contentBlock}>
                                                <Text style={styles.sectionTitle}>Patient Education</Text>
                                                <Text style={styles.sectionContent}>
                                                    {safe(drug.education)}
                                                </Text>
                                            </View>
                                        )}
                                    </>
                                )}
                            </View>
                        </View>
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
        maxWidth: 480,
        minWidth: 320,
        height: 400,
        alignSelf: "center",
        marginBottom: spacing.md,
        perspective: 1200,
    },

    absoluteCard: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
    },

    card: {
        width: "100%",
        flex: 1,
        borderRadius: 24,
        padding: spacing.xs + 2,
        backgroundColor: cardColors.card,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        borderWidth: 1,
        borderColor: "rgba(61, 106, 159, 0.2)",
        overflow: "hidden",
    },

    frontCenter: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: spacing.lg,
    },

    generic: {
        fontSize: 36,
        fontWeight: "900",
        textAlign: "center",
        color: cardColors.textPrimary,
        marginBottom: spacing.sm,
        letterSpacing: 0.5,
    },

    brand: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        color: cardColors.textMuted,
        marginBottom: spacing.md,
        fontStyle: "italic",
    },

    classText: {
        fontSize: 16,
        textAlign: "center",
        color: cardColors.accent,
        backgroundColor: "rgba(61, 106, 159, 0.15)",
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        overflow: "hidden",
        fontWeight: "600",
    },

    tapText: {
        textAlign: "center",
        color: cardColors.accent,
        fontSize: 13,
        marginTop: spacing.md,
        opacity: 0.85,
        fontWeight: "500",
        letterSpacing: 0.3,
    },

    backContent: {
        flex: 1,
        justifyContent: "center",
    },

    sectionsContainer: {
        flex: 1,
        justifyContent: "space-evenly",
        paddingVertical: spacing.sm,
        alignItems: "center",
    },

    contentBlock: {
        marginBottom: spacing.lg,
        flexShrink: 1,
        width: "100%",
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: cardColors.accent,
        letterSpacing: 0.3,
        marginBottom: 2,
        flexShrink: 0,
        textAlign: "center",
    },

    sectionContent: {
        fontSize: 14,
        lineHeight: 21,
        color: cardColors.textPrimary,
        flexShrink: 1,
        textAlign: "center",
    },

    dosageRow: {
        flexDirection: "row",
        gap: spacing.md,
        marginBottom: spacing.lg,
        width: "100%",
        justifyContent: "center",
    },

    dosageBlock: {
        flex: 1,
        flexShrink: 1,
        alignItems: "center",
        maxWidth: "33%",
    },
});
