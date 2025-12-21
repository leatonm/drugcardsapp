import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";
import AppHeader from "../../components/AppHeader";
import { useUserScope, UserScope } from "../../hooks/useUserScope";

const SCOPE_OPTIONS: UserScope[] = ["EMT", "AEMT", "RN", "Paramedic"];
const DISCLAIMER_KEY = "homeDisclaimerAccepted";

export default function HomeScreen() {
    const { scope, updateScope } = useUserScope();

    const [scopeModalVisible, setScopeModalVisible] = useState(false);
    const [disclaimerVisible, setDisclaimerVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;

    /* 🔍 Check disclaimer on first load */
    useEffect(() => {
        const checkDisclaimer = async () => {
            const accepted = await AsyncStorage.getItem(DISCLAIMER_KEY);
            if (!accepted) setDisclaimerVisible(true);
        };
        checkDisclaimer();
    }, []);

    const acceptDisclaimer = async () => {
        await AsyncStorage.setItem(DISCLAIMER_KEY, "true");
        setDisclaimerVisible(false);
    };

    /* 🎬 Animate scope modal */
    useEffect(() => {
        if (!scopeModalVisible) return;

        fadeAnim.setValue(0);
        scaleAnim.setValue(0.85);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scopeModalVisible]);

    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <AppHeader />
                <Text style={styles.subtitle}>Select a mode to begin.</Text>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.studyButton}
                        onPress={() => router.push("/study")}
                    >
                        <Text style={styles.buttonText}>Study</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quizButton}
                        onPress={() => router.push("/quiz")}
                    >
                        <Text style={styles.buttonText}>Quiz</Text>
                    </TouchableOpacity>
                </View>

                {/* LEVEL SELECTOR */}
                <TouchableOpacity
                    style={styles.levelContainer}
                    onPress={() => setScopeModalVisible(true)}
                >
                    <Text style={styles.levelLabel}>Level:</Text>
                    <Text style={styles.levelValue}>{scope}</Text>
                </TouchableOpacity>

                {/* Disclaimer Link */}
                <Pressable
                    onPress={() => setDisclaimerVisible(true)}
                    style={styles.disclaimerLink}
                >
                    <Text style={styles.disclaimerText}>Disclaimer</Text>
                </Pressable>

                {/* Instructor Portal */}
                <Pressable
                    onPress={() => alert("Instructor Portal Coming Soon")}
                    style={styles.instructorLink}
                >
                    <Text style={styles.instructorText}>Instructor Portal</Text>
                </Pressable>
            </View>

            {/* SCOPE MODAL */}
            <Modal
                visible={scopeModalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setScopeModalVisible(false)}
            >
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        {SCOPE_OPTIONS.map(option => (
                            <Pressable
                                key={option}
                                style={[
                                    styles.modalButton,
                                    option === scope && styles.modalButtonActive,
                                ]}
                                onPress={() => {
                                    updateScope(option);
                                    setScopeModalVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        option === scope &&
                                        styles.modalButtonTextActive,
                                    ]}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        ))}

                        <TouchableOpacity
                            style={[
                                styles.modalButton,
                                { backgroundColor: colors.accent },
                            ]}
                            onPress={() => setScopeModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>

            {/* DISCLAIMER MODAL */}
            <Modal visible={disclaimerVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.disclaimerModal}>
                        <Text style={styles.disclaimerTitle}>
                            Medical Disclaimer
                        </Text>

                        <Text style={styles.disclaimerBody}>
                            This application is for educational purposes only.
                            It is not a substitute for professional medical
                            advice, clinical judgment, or local protocols.
                            Drug information may vary by agency and medical
                            direction. Always follow your local protocols and
                            consult medical control when required.
                        </Text>

                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={acceptDisclaimer}
                        >
                            <Text style={styles.acceptButtonText}>
                                I Understand
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
    },

    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted,
    },

    section: {
        marginBottom: spacing.md,
        alignItems: "center",
    },

    studyButton: {
        width: 250,
        backgroundColor: "#3D6A9F",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
    },

    quizButton: {
        width: 250,
        backgroundColor: "#DC3545",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
    },

    levelContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: "#3D6A9F22",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#3D6A9F",
    },

    levelLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 6,
    },

    levelValue: {
        fontSize: 18,
        color: "#3D6A9F",
        fontWeight: "800",
        textDecorationLine: "underline",
    },

    disclaimerLink: {
        marginBottom: spacing.sm,
    },

    disclaimerText: {
        fontSize: 14,
        color: colors.accent,
        textDecorationLine: "underline",
        fontWeight: "600",
    },

    instructorLink: {
        paddingVertical: 6,
    },

    instructorText: {
        color: "#6c757d",
        fontSize: 14,
        textDecorationLine: "underline",
    },

    buttonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },

    modalContent: {
        width: 300,
        backgroundColor: colors.background,
        padding: spacing.lg,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#3D6A9F",
    },

    modalButton: {
        paddingVertical: spacing.md,
        borderRadius: 14,
        backgroundColor: colors.card,
        marginBottom: spacing.sm,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3D6A9F",
    },

    modalButtonActive: {
        backgroundColor: "#3D6A9F",
    },

    modalButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
    },

    modalButtonTextActive: {
        color: colors.buttonText,
        fontWeight: "700",
    },

    disclaimerModal: {
        width: "85%",
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.accent,
    },

    disclaimerTitle: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: spacing.sm,
        textAlign: "center",
    },

    disclaimerBody: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
        marginBottom: spacing.lg,
    },

    acceptButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 14,
        alignItems: "center",
    },

    acceptButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});
