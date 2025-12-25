// components/AdPlaceholder.tsx
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

type AdPlaceholderProps = {
    visible: boolean;
    onClose: () => void;
};

export default function AdPlaceholder({ visible, onClose }: AdPlaceholderProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.adContainer}>
                    <Text style={styles.adTitle}>Advertisement</Text>
                    <View style={styles.adContent}>
                        <Text style={styles.adText}>
                            Ad placeholder - Your ad will appear here
                        </Text>
                        <Text style={styles.adSubtext}>
                            Ad Unit ID: [PLACEHOLDER_AD_ID]
                        </Text>
                    </View>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    adContainer: {
        width: "85%",
        maxWidth: 400,
        backgroundColor: colors.background,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 2,
        borderColor: colors.accent,
    },
    adTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: "center",
    },
    adContent: {
        backgroundColor: colors.card,
        padding: spacing.lg,
        borderRadius: 12,
        marginBottom: spacing.md,
        minHeight: 200,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.inputBorder,
    },
    adText: {
        fontSize: 16,
        color: colors.textMuted,
        textAlign: "center",
        marginBottom: spacing.sm,
    },
    adSubtext: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: "center",
        fontStyle: "italic",
    },
    closeButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 12,
        alignItems: "center",
    },
    closeButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});

