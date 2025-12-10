import { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    Pressable
} from "react-native";
import { router } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";
import AppHeader from "../../components/AppHeader";
import { useUserScope, UserScope } from "../../hooks/useUserScope";

const SCOPE_OPTIONS: UserScope[] = ["ALL", "EMT", "Paramedic", "RN"];

export default function HomeScreen() {
    const { scope, updateScope } = useUserScope();
    const [modalVisible, setModalVisible] = useState(false);

    // 🔵 Animation Values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;

    // Run animation on modal open
    const animateOpen = () => {
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
    };

    useEffect(() => {
        if (modalVisible) animateOpen();
    }, [modalVisible]);

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={100} topSpacing={spacing.sm} />

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
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.levelLabel}>Level:</Text>
                <Text style={styles.levelValue}>{scope}</Text>
            </TouchableOpacity>

            {/* Instructor Portal — de-emphasized */}
            <View style={styles.instructorWrapper}>
                <Pressable
                    onPress={() => alert("Instructor Portal Coming Soon")}
                    style={({ pressed }) => [
                        styles.instructorLink,
                        pressed && { opacity: 0.5 }
                    ]}
                >
                    <Text style={styles.instructorText}>Instructor Portal</Text>
                </Pressable>
            </View>


            {/* MODAL */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <Animated.View
                    style={[
                        styles.modalOverlay,
                        { opacity: fadeAnim } // fade in background
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ scale: scaleAnim }], // scale animation
                            },
                        ]}
                    >
                        {SCOPE_OPTIONS.map(option => (
                            <Pressable
                                key={option}
                                style={({ pressed }) => [
                                    styles.modalButton,
                                    option === scope && styles.modalButtonActive,
                                    pressed && { transform: [{ scale: 0.96 }] } // Press animation
                                ]}
                                onPress={() => {
                                    updateScope(option);
                                    setModalVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.modalButtonText,
                                        option === scope && styles.modalButtonTextActive
                                    ]}
                                >
                                    {option}
                                </Text>
                            </Pressable>
                        ))}

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: colors.accent }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>
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

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.xl,
        color: colors.textMuted,
    },

    section: {
        marginBottom: spacing.lg,
        alignItems: "center",
    },

    studyButton: {
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

    quizButton: {
        width: 250,
        backgroundColor: "#DC3545",
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

    levelContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        backgroundColor: "#3DA5D922",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#3DA5D9",
    },
    levelLabel: {
        fontSize: 16,
        color: "#000",
        fontWeight: "600",
        marginRight: 6,
    },
    levelValue: {
        fontSize: 18,
        color: "#3DA5D9",
        fontWeight: "800",
        textDecorationLine: "underline",
    },

    instructorWrapper: {
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
        alignItems: "center",
    },

    // Looks like a small, secondary link instead of a button
    instructorLink: {
        paddingVertical: 6,
        paddingHorizontal: 10,
    },

    instructorText: {
        color: "#6c757d",      // muted gray instead of bright or accent color
        fontSize: 14,
        fontWeight: "500",
        textDecorationLine: "underline",
    },


    buttonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
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
        borderColor: "#3DA5D9",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },

    modalButton: {
        paddingVertical: spacing.md,
        borderRadius: 14,
        backgroundColor: colors.card,
        marginBottom: spacing.sm,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3DA5D9",
    },
    modalButtonActive: {
        backgroundColor: "#3DA5D9",
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
});
