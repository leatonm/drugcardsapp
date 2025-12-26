import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useDrugs } from "../hooks/getDrugs";
import { UserScope, useUserScope } from "../hooks/useUserScope";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

const SCOPE_OPTIONS: UserScope[] = ["EMT", "AEMT", "RN", "Paramedic"];

type UserProfileModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function UserProfileModal({
    visible,
    onClose,
}: UserProfileModalProps) {
    const { user, logout, upgradeToPremium } = useAuth();
    const { scope } = useUserScope();
    const router = useRouter();
    const [exportScope, setExportScope] = useState<UserScope>(scope);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
    const { drugs } = useDrugs(exportScope);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        if (!visible) return;

        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);

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
    }, [visible]);

    const handleUpgrade = () => {
        // Show upgrade modal with features and pricing
        setUpgradeModalVisible(true);
    };

    const handleExport = () => {
        // Check if user has premium access
        if (user.membershipTier !== "premium") {
            alert("Export drug cards is a Premium feature. Upgrade to access this feature!");
            setUpgradeModalVisible(true);
            return;
        }
        setExportModalVisible(true);
    };

    const handlePurchase = () => {
        // In production, this would integrate with payment system (Stripe, RevenueCat, etc.)
        // For now, simulate upgrade
        upgradeToPremium();
        setUpgradeModalVisible(false);
        alert("Thank you for upgrading to Premium! All features are now unlocked.");
        onClose();
    };

    const exportToCSV = () => {
        try {
            // Convert drugs to CSV format
            const headers = [
                "Generic Name",
                "Brand Name",
                "Class",
                "Mechanism",
                "Indications",
                "Contraindications",
                "Adult Dose",
                "Pediatric Dose",
                "Routes",
                "Interactions",
                "Patient Education",
            ];

            const rows = drugs.map((drug) => {
                const safe = (value: any): string => {
                    if (value == null) return "";
                    if (Array.isArray(value)) return value.join("; ");
                    return String(value);
                };

                return [
                    safe(drug.name?.generic),
                    safe(drug.name?.brand),
                    safe(drug.class),
                    safe(drug.mechanism),
                    safe(drug.indications),
                    safe(drug.contraindications),
                    safe(drug.adultDose),
                    safe(drug.pediatricDose),
                    safe(drug.routes),
                    safe(drug.interactions),
                    safe(drug.education),
                ];
            });

            // Create CSV content
            const csvContent = [
                headers.join(","),
                ...rows.map((row) =>
                    row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
                ),
            ].join("\n");

            // Create blob and download (web only)
            if (typeof window !== "undefined") {
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute(
                    "download",
                    `drug-cards-${exportScope}-${new Date().toISOString().split("T")[0]}.csv`
                );
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                alert(`Exported ${drugs.length} drug cards for ${exportScope} scope!`);
                setExportModalVisible(false);
                onClose();
            } else {
                alert("Export is currently only available on web. Mobile export coming soon!");
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export drug cards. Please try again.");
        }
    };

    const exportToPDF = () => {
        // Placeholder for PDF export
        // In the future, this could use a library like react-pdf or expo-print
        alert("PDF export coming soon! For now, please use CSV export.");
    };

    return (
        <>
            <Modal
                visible={visible}
                transparent
                animationType="none"
                onRequestClose={onClose}
            >
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title}>User Profile</Text>
                                <Pressable onPress={onClose} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </Pressable>
                            </View>

                            {/* User Info */}
                            <View style={styles.userInfoSection}>
                                <Text style={styles.userEmail}>
                                    {user.email || "Guest User"}
                                </Text>
                                <View style={styles.membershipBadge}>
                                    <Text style={styles.membershipText}>
                                        {user.membershipTier === "free"
                                            ? "Free Tier"
                                            : "Premium"}
                                    </Text>
                                </View>
                            </View>

                            {/* Menu Options */}
                            <View style={styles.menuSection}>
                                {/* Upgrade Option */}
                                <Pressable
                                    style={styles.menuItem}
                                    onPress={handleUpgrade}
                                >
                                    <Text style={styles.menuIcon}>⭐</Text>
                                    <View style={styles.menuItemContent}>
                                        <Text style={styles.menuItemTitle}>
                                            Upgrade to Premium
                                        </Text>
                                        <Text style={styles.menuItemSubtext}>
                                            Unlock all features and remove limitations
                                        </Text>
                                    </View>
                                    {user.membershipTier === "free" && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>NEW</Text>
                                        </View>
                                    )}
                                </Pressable>

                                {/* Export Option */}
                                <Pressable
                                    style={[
                                        styles.menuItem,
                                        user.membershipTier !== "premium" && styles.menuItemDisabled,
                                    ]}
                                    onPress={handleExport}
                                    disabled={user.membershipTier !== "premium"}
                                >
                                    <Text style={styles.menuIcon}>📥</Text>
                                    <View style={styles.menuItemContent}>
                                        <Text style={[
                                            styles.menuItemTitle,
                                            user.membershipTier !== "premium" && styles.menuItemTitleDisabled,
                                        ]}>
                                            Export Drug Cards
                                        </Text>
                                        <Text style={styles.menuItemSubtext}>
                                            Download your drug cards as CSV or PDF
                                            {user.membershipTier !== "premium" && " ⭐"}
                                        </Text>
                                    </View>
                                </Pressable>

                                {/* Logout */}
                                {user.isLoggedIn && (
                                    <Pressable
                                        style={[styles.menuItem, styles.logoutItem]}
                                        onPress={() => {
                                            logout();
                                            onClose();
                                        }}
                                    >
                                        <Text style={styles.menuIcon}>🚪</Text>
                                        <View style={styles.menuItemContent}>
                                            <Text
                                                style={[
                                                    styles.menuItemTitle,
                                                    styles.logoutText,
                                                ]}
                                            >
                                                Logout
                                            </Text>
                                        </View>
                                    </Pressable>
                                )}
                            </View>
                        </ScrollView>
                    </Animated.View>
                </Animated.View>
            </Modal>

            {/* Export Modal */}
            <Modal
                visible={exportModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setExportModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.exportModal}>
                        <Text style={styles.exportTitle}>Export Drug Cards</Text>
                        <Text style={styles.exportSubtext}>
                            Select the credential level to export:
                        </Text>

                        <View style={styles.scopeOptions}>
                            {SCOPE_OPTIONS.map((option) => (
                                <Pressable
                                    key={option}
                                    style={[
                                        styles.scopeOption,
                                        exportScope === option && styles.scopeOptionActive,
                                    ]}
                                    onPress={() => setExportScope(option)}
                                >
                                    <Text
                                        style={[
                                            styles.scopeOptionText,
                                            exportScope === option &&
                                                styles.scopeOptionTextActive,
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.exportCount}>
                            {drugs.length} drug cards available for {exportScope}
                        </Text>

                        <View style={styles.exportButtons}>
                            <Pressable
                                style={[styles.exportButton, styles.csvButton]}
                                onPress={exportToCSV}
                            >
                                <Text style={styles.exportButtonText}>Export as CSV</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.exportButton, styles.pdfButton]}
                                onPress={exportToPDF}
                            >
                                <Text style={styles.exportButtonText}>Export as PDF</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setExportModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Upgrade Modal */}
            <Modal
                visible={upgradeModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setUpgradeModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.upgradeModal}>
                        <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
                        <Text style={styles.upgradePrice}>$4.99/month</Text>

                        <View style={styles.featuresList}>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>✓</Text>
                                <Text style={styles.featureText}>
                                    Unlock all quiz question options
                                </Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>✓</Text>
                                <Text style={styles.featureText}>
                                    Critical Thinking Questions
                                </Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>✓</Text>
                                <Text style={styles.featureText}>
                                    Export drug cards (CSV/PDF)
                                </Text>
                            </View>
                            <View style={styles.featureItem}>
                                <Text style={styles.featureIcon}>✓</Text>
                                <Text style={styles.featureText}>
                                    No ads - uninterrupted studying
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            style={styles.purchaseButton}
                            onPress={handlePurchase}
                        >
                            <Text style={styles.purchaseButtonText}>
                                Subscribe for $4.99/month
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelUpgradeButton}
                            onPress={() => setUpgradeModalVisible(false)}
                        >
                            <Text style={styles.cancelUpgradeButtonText}>
                                Maybe Later
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: spacing.lg,
        maxHeight: "80%",
        borderWidth: 2,
        borderColor: colors.accent,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: colors.textPrimary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.card,
        justifyContent: "center",
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    userInfoSection: {
        marginBottom: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
    },
    userEmail: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    membershipBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#3D6A9F22",
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#3D6A9F",
    },
    membershipText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#3D6A9F",
    },
    menuSection: {
        gap: spacing.sm,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: spacing.xs / 2,
    },
    menuItemSubtext: {
        fontSize: 12,
        color: colors.textMuted,
    },
    badge: {
        backgroundColor: colors.danger,
        paddingVertical: 2,
        paddingHorizontal: spacing.xs,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#FFF",
    },
    logoutItem: {
        marginTop: spacing.sm,
        borderColor: colors.danger,
    },
    logoutText: {
        color: colors.danger,
    },
    exportModal: {
        width: "85%",
        maxWidth: 400,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.accent,
    },
    exportTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textAlign: "center",
    },
    exportSubtext: {
        fontSize: 14,
        color: colors.textMuted,
        marginBottom: spacing.md,
        textAlign: "center",
    },
    scopeOptions: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        marginBottom: spacing.md,
        justifyContent: "center",
    },
    scopeOption: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.card,
        borderWidth: 2,
        borderColor: colors.inputBorder,
        minWidth: 80,
    },
    scopeOptionActive: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
    },
    scopeOptionText: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textPrimary,
        textAlign: "center",
    },
    scopeOptionTextActive: {
        color: colors.buttonText,
        fontWeight: "700",
    },
    exportCount: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: "center",
        marginBottom: spacing.md,
        fontStyle: "italic",
    },
    exportButtons: {
        flexDirection: "row",
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    exportButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: "center",
    },
    csvButton: {
        backgroundColor: "#00C98B",
    },
    pdfButton: {
        backgroundColor: colors.accent,
    },
    exportButtonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "700",
    },
    cancelButton: {
        paddingVertical: spacing.sm,
        alignItems: "center",
    },
    cancelButtonText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: "600",
    },

    upgradeModal: {
        width: "85%",
        maxWidth: 400,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.accent,
    },
    upgradeTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: spacing.xs,
    },
    upgradePrice: {
        fontSize: 32,
        fontWeight: "900",
        color: colors.accent,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    featuresList: {
        marginBottom: spacing.lg,
    },
    featureItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: spacing.sm,
    },
    featureIcon: {
        fontSize: 18,
        fontWeight: "700",
        color: "#00C98B",
        marginRight: spacing.sm,
        marginTop: 2,
    },
    featureText: {
        flex: 1,
        fontSize: 15,
        color: "#1A1A1A",
        lineHeight: 22,
        fontWeight: "500",
    },
    purchaseButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: spacing.sm,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    purchaseButtonText: {
        color: colors.buttonText,
        fontSize: 18,
        fontWeight: "700",
    },
    cancelUpgradeButton: {
        paddingVertical: spacing.sm,
        alignItems: "center",
    },
    cancelUpgradeButtonText: {
        color: colors.textMuted,
        fontSize: 14,
        fontWeight: "600",
    },
    menuItemDisabled: {
        opacity: 0.6,
    },
    menuItemTitleDisabled: {
        color: colors.textMuted,
    },
});

