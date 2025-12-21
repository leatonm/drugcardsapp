// app/study/all/index.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { spacing } from "../../../styles/spacing";
import { colors } from "../../../styles/colors";
import AppHeader from "../../../components/AppHeader";

export default function StudyAllScreen() {
    const router = useRouter();
    const { scope } = useUserScope();
    const { drugs, loading } = useDrugs(scope);

    const handleStart = () => {
        const shuffled = [...drugs].sort(() => Math.random() - 0.5);
        router.push({
            pathname: "/study/viewer",
            params: { data: JSON.stringify(shuffled) },
        });
    };

    return (
        <View style={styles.container}>
            {/* 👇 CENTERED CONTENT */}
            <View style={styles.contentWrapper}>
                <AppHeader />

                {/* 🟦 STUDY MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>STUDY MODE</Text>
                </View>

                <Text style={styles.subtitle}>Study All Drugs</Text>

                {loading ? (
                    <Text style={styles.loadingText}>Loading…</Text>
                ) : (
                    <Pressable
                        style={styles.startButton}
                        onPress={handleStart}
                    >
                        <Text style={styles.startButtonText}>Start</Text>
                    </Pressable>
                )}

                {/* ✅ ALWAYS GO BACK TO STUDY INDEX */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/study")}
                >
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
    },

    /* 🔑 Matches Home / Study / Login alignment */
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
    },

    /* 🔵 STUDY MODE BANNER */
    modeBanner: {
        marginBottom: spacing.lg,
        backgroundColor: "#3D6A9F44",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
    },
    modeBannerText: {
        color: "#3D6A9F",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted,
    },

    loadingText: {
        fontSize: 16,
        color: colors.textMuted,
        marginBottom: spacing.md,
    },

    startButton: {
        width: 250,
        backgroundColor: "#3D6A9F",
        paddingVertical: spacing.md,
        borderRadius: 16,
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
        textAlign: "center",
    },

    backButton: {
        width: 250,
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginTop: spacing.md,
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
        textAlign: "center",
    },
});
