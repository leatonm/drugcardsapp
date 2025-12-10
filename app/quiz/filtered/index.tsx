import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView
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

export default function FilteredQuiz() {
    const router = useRouter();

    // ✅ Apply user scope to drug list
    const { scope } = useUserScope();
    const { drugs, loading } = useDrugs(scope);

    const [selectedCategory, setSelectedCategory] = useState < string | null > (null);
    const [modalVisible, setModalVisible] = useState(false);

    if (loading) return <Text style={styles.loading}>Loading...</Text>;

    const filteredDrugs = useMemo(() => {
        if (!selectedCategory) return [];
        return drugs.filter(d =>
            CATEGORY_MAP[selectedCategory]?.includes(d.class)
        );
    }, [selectedCategory, drugs]);

    const handleStart = () => {
        if (!filteredDrugs.length) {
            alert("No drugs found for this category.");
            return;
        }

        router.push({
            pathname: "/quiz/viewer",
            params: { data: JSON.stringify(filteredDrugs), start: "true" }
        });
    };

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={100} topSpacing={spacing.sm} />

            {/* 🟥 QUIZ MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>QUIZ MODE</Text>
            </View>

            <Text style={styles.subtitle}>Select a category:</Text>

            {/* Dropdown */}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.dropdownText}>
                    {selectedCategory || "Select a category..."}
                </Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {CATEGORIES.map(cat => (
                                <TouchableOpacity
                                    key={cat}
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setSelectedCategory(cat);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>{cat}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Start Quiz */}
            <TouchableOpacity
                style={[styles.startButton, !selectedCategory && { opacity: 0.5 }]}
                disabled={!selectedCategory}
                onPress={handleStart}
            >
                <Text style={styles.startButtonText}>Start Quiz</Text>
            </TouchableOpacity>

            {/* Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/quiz")}
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
        paddingTop: spacing.md
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        alignSelf: "center",
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted
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
        elevation: 4
    },
    dropdownText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600"
    },

    /* Start Button */
    startButton: {
        width: 250,
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginTop: spacing.md,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4
    },
    startButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700"
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        width: 280,
        backgroundColor: colors.background,
        borderRadius: 18,
        padding: spacing.md,
        maxHeight: "70%",
        borderWidth: 2,
        borderColor: "#DC3545",
        shadowColor: "#DC3545",
        shadowOpacity: 0.6,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 10
    },

    modalButton: {
        backgroundColor: "#DC354599",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: "#DC3545",
        alignItems: "center"
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    cancelButton: {
        backgroundColor: "#DC3545",
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        marginTop: spacing.sm
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700"
    },

    backButton: {
        width: 250,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.lg,
        alignItems: "center"
    },
    backText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600"
    },

    loading: {
        textAlign: "center",
        marginTop: spacing.xl,
        fontSize: 16,
        color: colors.textPrimary
    }
});
