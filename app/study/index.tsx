// app/study/index.tsx
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";
import AppHeader from "../../components/AppHeader";

// Only two options now — Scope is global
const OPTIONS = [
    { key: "all", label: "Drug Cards" },
    { key: "filtered", label: "Filtered Drug Cards" },
];

export default function StudyIndex() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* 👇 CENTERED CONTENT (matches Home & Login) */}
            <View style={styles.contentWrapper}>
                <AppHeader />

                {/* 🟦 STUDY MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>STUDY MODE</Text>
                </View>

                <Text style={styles.subtitle}>
                    Choose a study mode to begin
                </Text>

                <View style={styles.options}>
                    {OPTIONS.map(opt => (
                        <Pressable
                            key={opt.key}
                            style={({ pressed }) => [
                                styles.optionButton,
                                pressed && { transform: [{ scale: 0.97 }] },
                            ]}
                            onPress={() =>
                                router.push(`/study/${opt.key}`)
                            }
                        >
                            <Text style={styles.optionButtonText}>
                                {opt.label}
                            </Text>
                        </Pressable>
                    ))}

                    {/* ✅ ALWAYS GO HOME */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace("/home")}
                    >
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
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

    /* 🔑 Same vertical alignment trick as Home/Login */
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 120,
    },

    /* 🟦 STUDY MODE BANNER */
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
        letterSpacing: 1.2,
        textAlign: "center",
    },

    subtitle: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: spacing.md,
        color: colors.textMuted,
    },

    options: {
        width: "100%",
        alignItems: "center",
    },

    /* 🔵 STUDY MODE BUTTONS */
    optionButton: {
        width: 250,
        backgroundColor: "#3DA5D9",
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    optionButtonText: {
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
        shadowRadius: 6,
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
