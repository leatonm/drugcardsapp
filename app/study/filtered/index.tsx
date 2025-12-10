import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Pressable
} from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { spacing } from "../../../styles/spacing";
import { colors } from "../../../styles/colors";
import AppHeader from "../../../components/AppHeader";

// Category mapping
const CATEGORY_MAP: Record<string, string[]> = {
    Cardiac: ["Antiarrhythmic", "Vasodilator", "Sympathomimetic"],
    Respiratory: ["Gas", "Bronchodilator"],
    Pain: ["Opioid Analgesic", "Non-Opioid Analgesic"],
    Sedation: ["Sedative", "Anxiolytic"],
    Allergy: ["Antihistamine", "Epinephrine"]
};

const CATEGORIES = Object.keys(CATEGORY_MAP);

export default function FilteredStudyScreen() {
    const router = useRouter();
    const { scope } = useUserScope();
    const { drugs, loading } = useDrugs(scope);   // ✅ now filtered by user level

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (loading) return <Text style={styles.loading}>Loading...</Text>;

    // Apply category filter on top of scope filter
    const filteredDrugs = selectedCategory
        ? drugs.filter(d => CATEGORY_MAP[selectedCategory]?.includes(d.class))
        : [];

    const handleStart = () => {
        if (!filteredDrugs.length) {
            alert("No drugs found for this category.");
            return;
        }
        router.push({
            pathname: "/study/viewer",
            params: { data: JSON.stringify(filteredDrugs) },
        });
    };

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={100} topSpacing={spacing.sm} />

            {/* 🟦 STUDY MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>STUDY MODE</Text>
            </View>

            <Text style={styles.subtitle}>Select a category:</Text>

            {/* CATEGORY SELECT DROPDOWN */}
            <Pressable
                style={({ pressed }) => [
                    styles.dropdown,
                    pressed && { transform: [{ scale: 0.97 }] }
                ]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownText}>
                    {selectedCategory || "Select a category..."}
                </Text>
            </Pressable>

            {/* MODAL */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {CATEGORIES.map(cat => (
                                <Pressable
                                    key={cat}
                                    style={({ pressed }) => [
                                        styles.modalOption,
                                        pressed && { backgroundColor: "#3DA5D955" }
                                    ]}
                                    onPress={() => {
                                        setSelectedCategory(cat);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Cancel */}
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* START BUTTON */}
            <Pressable
                style={({ pressed }) => [
                    styles.startButton,
                    pressed && selectedCategory && { transform: [{ scale: 0.97 }] },
                    !selectedCategory && { opacity: 0.5 }
                ]}
                disabled={!selectedCategory}
                onPress={handleStart}
            >
                <Text style={styles.startButtonText}>Start</Text>
            </Pressable>

            {/* BACK */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/study")}
            >
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
    },

    modeBanner: {
        marginBottom: spacing.lg,
        backgroundColor: "#3DA5D944",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
    },
    modeBannerText: {
        color: "#3DA5D9",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.1,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted,
    },

    dropdown: {
        width: 250,
        backgroundColor: colors.card,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    dropdownText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: 300,
        backgroundColor: "#0F1E2E",
        borderRadius: 18,
        padding: spacing.lg,
        maxHeight: "70%",
        borderWidth: 2,
        borderColor: "#3DA5D9",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 6 },
    },

    modalOption: {
        backgroundColor: "#3DA5D933",
        borderWidth: 1,
        borderColor: "#3DA5D9",
        paddingVertical: spacing.md,
        borderRadius: 14,
        marginBottom: spacing.md,
        alignItems: "center",
    },
    modalOptionText: {
        color: "#E6F4FF",
        fontSize: 16,
        fontWeight: "700",
    },

    modalCancel: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 14,
        marginTop: spacing.md,
        alignItems: "center",
    },
    modalCancelText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    startButton: {
        width: 250,
        backgroundColor: "#3DA5D9",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    startButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    backButton: {
        width: 250,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.lg,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    backText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },

    loading: {
        marginTop: spacing.xl,
        fontSize: 16,
        color: colors.textPrimary,
        textAlign: "center",
    },
});
