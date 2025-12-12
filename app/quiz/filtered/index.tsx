// app/quiz/filtered/index.tsx
import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { spacing } from "../../../styles/spacing";
import { colors } from "../../../styles/colors";
import AppHeader from "../../../components/AppHeader";

// Category mapping
export const CATEGORY_MAP: Record<string, string[]> = {

  /* ❤️ CARDIAC */
  Cardiac: [
    "ACE Inhibitor",
    "Vasodilator",

    // Antiarrhythmics
    "Class V Antidysrhythmic",
    "Class III Antidysrhythmic",
    "Class Ib Antidysrhythmic",
    "Class Ia Antiarrhythmic",
    "Beta-Blocker (Class II Antiarrhythmic)",
    "Calcium Channel Blocker (Class IV Antidysrhythmic)",

    // Pressors / inotropes
    "Alpha/Beta Agonist, Vasopressor",
    "Inotropic Vasopressor",
    "Adrenergic Inotropic Agent",
    "Alpha-Agonist Vasopressor",
    "Vasopressor",

    // Cardiac adjuncts
    "Anticholinergic",      // atropine (bradycardia)
    "Electrolyte",          // Mg, Ca (cardiac effects)
    "Alkalizing Agent"      // sodium bicarbonate
  ],

  /* 🫁 RESPIRATORY */
  Respiratory: [
    "Atmospheric Gas",
    "Medical Gas",

    "Beta-2 Agonist",
    "Anticholinergic",
    "Corticosteroid",

    "Gaseous Analgesic / Anesthetic",
    "Inhaled Analgesic",

    "Vasoconstrictor",      // oxymetazoline
    "Nasal Decongestant"
  ],

  /* 💉 PAIN */
  Pain: [
    "Opioid Analgesic",

    "Analgesic / Antipyretic",
    "Analgesic/Antipyretic",

    "NSAID",
    "NSAID Analgesic",

    "Dissociative Analgesic",
    "Anesthetic / Analgesic",
    "Gaseous Analgesic / Anesthetic"
  ],

  /* 😴 SEDATION / RSI */
  Sedation: [
    "Sedative / Hypnotic",
    "Sedative Hypnotic",

    "Benzodiazepine",
    "Antiemetic / Antipsychotic",

    "Dissociative Analgesic",
    "Anesthetic / Analgesic",

    "Non-depolarizing Neuromuscular Blocker",
    "Depolarizing Neuromuscular Blocker"
  ],

  /* 🤧 ALLERGY / ANAPHYLAXIS */
  Allergy: [
    "Antihistamine",
    "Sympathomimetic",
    "Corticosteroid",
    "Benzodiazepine"   // agitation/anxiety during reactions
  ],

  /* 🦠 ANTIBIOTICS */
  Antibiotic: [
    "Antibiotic",
    "Antibiotic (Cephalosporin)",
    "Antibiotic (Penicillin)",
    "Antibiotic (Beta-lactam)",
    "Antibiotic (Macrolide)",
    "Antibiotic (Fluoroquinolone)",
    "Antibiotic (Aminoglycoside)",
    "Antibiotic (Glycopeptide)",
    "Antibiotic (Tetracycline)",
    "Antibiotic (Sulfonamide)",
    "Antibiotic (Carbapenem)",
    "Antibiotic (Lincosamide)",
    "Antibiotic (Nitroimidazole)"
  ],

  /* 🧪 TOX / ANTIDOTES */
  Toxicology: [
    "Antidote",
    "Benzodiazepine Antagonist",
    "Cholinesterase Reactivator"
  ],

  /* 🩸 FLUIDS / ELECTROLYTES */
  Fluids: [
    "Isotonic Solution",
    "Isotonic Crystalloid",
    "Hypertonic Glucose Solution",
    "Electrolyte"
  ],

  /* 🧠 NEURO / ENDOCRINE */
  NeuroEndocrine: [
    "Antidiabetic Hormone",
    "Hormone",
    "Pituitary Hormone",
    "Osmotic Diuretic"
  ]
};


const CATEGORIES = Object.keys(CATEGORY_MAP);

export default function FilteredQuiz() {
    const router = useRouter();
    const { scope } = useUserScope();
    const { drugs, loading } = useDrugs(scope);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    if (loading) {
        return <Text style={styles.loading}>Loading...</Text>;
    }

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
            params: { data: JSON.stringify(filteredDrugs), start: "true" },
        });
    };

    return (
        <View style={styles.container}>
            {/* 🔽 CENTERED CONTENT */}
            <View style={styles.contentWrapper}>
                <AppHeader />

                {/* 🟥 QUIZ MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>QUIZ MODE</Text>
                </View>

                <Text style={styles.subtitle}>Select a category:</Text>

                {/* Dropdown */}
                <Pressable
                    style={styles.dropdown}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.dropdownText}>
                        {selectedCategory || "Select a category..."}
                    </Text>
                </Pressable>

                {/* Start Quiz */}
                <Pressable
                    style={[
                        styles.startButton,
                        !selectedCategory && { opacity: 0.5 },
                    ]}
                    disabled={!selectedCategory}
                    onPress={handleStart}
                >
                    <Text style={styles.startButtonText}>Start Quiz</Text>
                </Pressable>

                {/* Back → ALWAYS Quiz Index */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/quiz")}
                >
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
            </View>

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {CATEGORIES.map(cat => (
                                <Pressable
                                    key={cat}
                                    style={styles.modalButton}
                                    onPress={() => {
                                        setSelectedCategory(cat);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalButtonText}>
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
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

    /* 🔑 Same vertical alignment as Home / Study */
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        backgroundColor: "#DC354544",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.lg,
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
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

    startButton: {
        width: 250,
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
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
        alignItems: "center",
    },
    backText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: 280,
        backgroundColor: colors.background,
        borderRadius: 18,
        padding: spacing.md,
        maxHeight: "70%",
        borderWidth: 2,
        borderColor: "#DC3545",
    },

    modalButton: {
        backgroundColor: "#DC354599",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        borderWidth: 2,
        borderColor: "#DC3545",
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    cancelButton: {
        backgroundColor: "#DC3545",
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    loading: {
        textAlign: "center",
        marginTop: spacing.xl,
        fontSize: 16,
        color: colors.textPrimary,
    },
});
