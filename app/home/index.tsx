// app/home/index.tsx
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
import { router } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";
import AppHeader from "../../components/AppHeader";
import { useUserScope, UserScope } from "../../hooks/useUserScope";

const SCOPE_OPTIONS: UserScope[] = ["EMT", "AEMT", "RN", "Paramedic"];

export default function HomeScreen() {
    const { scope, updateScope } = useUserScope();
    const [modalVisible, setModalVisible] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        if (!modalVisible) return;

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
    }, [modalVisible]);

    return (
        <View style={styles.container}>
            

            {/* 👇 CENTERED CONTENT */}
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
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.levelLabel}>Level:</Text>
                    <Text style={styles.levelValue}>{scope}</Text>
                </TouchableOpacity>

                {/* Instructor Portal */}
                <Pressable
                    onPress={() => alert("Instructor Portal Coming Soon")}
                    style={styles.instructorLink}
                >
                    <Text style={styles.instructorText}>Instructor Portal</Text>
                </Pressable>
            </View>

            {/* MODAL (unchanged) */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={() => setModalVisible(false)}
            >
                <Animated.View
                    style={[styles.modalOverlay, { opacity: fadeAnim }]}
                >
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
                                    option === scope &&
                                        styles.modalButtonActive,
                                ]}
                                onPress={() => {
                                    updateScope(option);
                                    setModalVisible(false);
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
    },

 contentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120, // 👈 SAME trick you used on Login
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
        backgroundColor: "#3DA5D9",
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
        marginBottom: spacing.lg,
        backgroundColor: "#3DA5D922",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#3DA5D9",
    },

    levelLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 6,
    },

    levelValue: {
        fontSize: 18,
        color: "#3DA5D9",
        fontWeight: "800",
        textDecorationLine: "underline",
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
        borderColor: "#3DA5D9",
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
