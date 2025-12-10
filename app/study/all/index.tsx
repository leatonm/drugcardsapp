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
    const { drugs, loading } = useDrugs(scope);   // ✅ now filtered by chosen level

    if (loading) return <Text>Loading...</Text>;

    const handleStart = () => {
        const shuffled = [...drugs].sort(() => Math.random() - 0.5);
        router.push({
            pathname: "/study/viewer",
            params: { data: JSON.stringify(shuffled) },
        });
    };

    return (
        <View style={styles.container}>
            <AppHeader logoHeight={100} topSpacing={spacing.sm} />

            {/* 🟦 STUDY MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>STUDY MODE</Text>
            </View>

            <Text style={styles.subtitle}>Study All Drugs</Text>

            <Pressable style={styles.startButton} onPress={handleStart}>
                <Text style={styles.startButtonText}>Start</Text>
            </Pressable>

            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.lg,
        alignItems: "center",
        paddingTop: 0,
    },

    /* 🟦 STUDY MODE BANNER */
    modeBanner: {
        marginTop: spacing.sm,
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
        letterSpacing: 1.2,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.xl,
        color: colors.textMuted,
    },

    startButton: {
        width: 250,
        backgroundColor: "#3DA5D9",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        alignItems: "center",
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
