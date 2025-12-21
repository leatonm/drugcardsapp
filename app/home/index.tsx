import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import AppHeader from "../../components/AppHeader";
import UserProfileModal from "../../components/UserProfileModal";
import { useAuth } from "../../hooks/useAuth";
import { UserScope, useUserScope } from "../../hooks/useUserScope";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";

const SCOPE_OPTIONS: UserScope[] = ["EMT", "AEMT", "RN", "Paramedic"];
const DISCLAIMER_KEY = "homeDisclaimerAccepted";

export default function HomeScreen() {
    const { scope, updateScope } = useUserScope();
    const { user } = useAuth();

    const [scopeModalVisible, setScopeModalVisible] = useState(false);
    const [disclaimerVisible, setDisclaimerVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);

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

                {/* User Status Card - Clickable to open profile */}
                <Pressable
                    style={styles.userCard}
                    onPress={() => {
                        if (user.isLoggedIn) {
                            setProfileModalVisible(true);
                        } else {
                            router.push("/login");
                        }
                    }}
                >
                    <View style={styles.userInfo}>
                        <Text style={styles.userGreeting}>
                            {user.isLoggedIn ? `Welcome back!` : `Welcome!`}
                        </Text>
                        <View style={styles.membershipBadge}>
                            <Text style={styles.membershipText}>
                                {user.membershipTier === "free" ? "Free Tier" : "Premium"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>
                            {user.isLoggedIn ? "View Profile" : "Login"}
                        </Text>
                    </View>
                </Pressable>

                {/* Main Action Buttons */}
                <View style={styles.actionButtons}>
                    <Pressable
                        style={styles.studyButton}
                        onPress={() => router.push("/study")}
                    >
                        <Text style={styles.studyButtonText}>Study</Text>
                        <Text style={styles.buttonSubtext}>Flashcards & Review</Text>
                    </Pressable>

                    <Pressable
                        style={styles.quizButton}
                        onPress={() => router.push("/quiz")}
                    >
                        <Text style={styles.quizButtonText}>Quiz</Text>
                        <Text style={styles.buttonSubtext}>Test Your Knowledge</Text>
                    </Pressable>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Pressable
                        style={styles.actionCard}
                        onPress={() => router.push("/statistics" as any)}
                    >
                        <Text style={styles.actionCardIcon}>📈</Text>
                        <Text style={styles.actionCardTitle}>Statistics</Text>
                        <Text style={styles.actionCardSubtext}>View Progress</Text>
                    </Pressable>

                    <Pressable
                        style={styles.actionCard}
                        onPress={() => setScopeModalVisible(true)}
                    >
                        <Text style={styles.actionCardIcon}>🎓</Text>
                        <Text style={styles.actionCardTitle}>Level: {scope}</Text>
                        <Text style={styles.actionCardSubtext}>Change Credentials</Text>
                    </Pressable>
                </View>

                {/* Footer Links */}
                <Pressable
                    onPress={() => setDisclaimerVisible(true)}
                    style={styles.footerLink}
                >
                    <Text style={styles.footerLinkText}>Disclaimer</Text>
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

            {/* USER PROFILE MODAL */}
            <UserProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
            />
        </View>
    );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    contentWrapper: {
        flex: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: 400, // Constrain width on web to match mobile
        alignSelf: "center",
        width: "100%",
        justifyContent: "center",
    },

    /* User Card */
    userCard: {
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    userInfo: {
        flex: 1,
    },
    userGreeting: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 4,
    },
    membershipBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#3D6A9F22",
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#3D6A9F",
    },
    membershipText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#3D6A9F",
    },
    loginButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: 10,
    },
    loginButtonText: {
        color: colors.buttonText,
        fontSize: 13,
        fontWeight: "700",
    },

    /* Main Action Buttons */
    actionButtons: {
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    studyButton: {
        backgroundColor: "#3D6A9F",
        padding: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    studyButtonText: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.buttonText,
        marginBottom: 2,
    },
    quizButton: {
        backgroundColor: colors.danger,
        padding: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    quizButtonText: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.buttonText,
        marginBottom: 2,
    },
    buttonSubtext: {
        fontSize: 12,
        color: colors.buttonText,
        opacity: 0.9,
        fontWeight: "500",
    },

    /* Quick Actions */
    quickActions: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    actionCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    actionCardIcon: {
        fontSize: 24,
        marginBottom: 4,
        // No color set - allows emoji to render in native color on all platforms
    },
    actionCardTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 2,
        textAlign: "center",
    },
    actionCardSubtext: {
        fontSize: 10,
        color: colors.textMuted,
        textAlign: "center",
    },

    /* Footer Links */
    footerLink: {
        paddingVertical: spacing.xs,
        alignItems: "center",
    },
    footerLinkText: {
        fontSize: 12,
        color: "#4A5568",
        textDecorationLine: "underline",
        fontWeight: "500",
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
        maxWidth: 400,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.accent,
        alignSelf: "center",
    },

    disclaimerTitle: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: spacing.sm,
        textAlign: "center",
        color: "#1A1A1A",
    },

    disclaimerBody: {
        fontSize: 15,
        lineHeight: 24,
        textAlign: "left",
        marginBottom: spacing.lg,
        color: "#1A1A1A",
        fontWeight: "500",
        paddingHorizontal: spacing.xs,
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
