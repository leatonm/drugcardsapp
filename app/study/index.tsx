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
                    <Pressable
                        style={styles.studyButton}
                        onPress={() => router.push("/study/all")}
                    >
                        <Text style={styles.studyButtonText}>Drug Cards</Text>
                        <Text style={styles.buttonSubtext}>Study All Drugs</Text>
                    </Pressable>

                    <Pressable
                        style={styles.studyButton}
                        onPress={() => router.push("/study/filtered")}
                    >
                        <Text style={styles.studyButtonText}>Filtered Drug Cards</Text>
                        <Text style={styles.buttonSubtext}>Study by Category</Text>
                    </Pressable>

                    <Pressable
                        style={styles.studyButton}
                        onPress={() => router.push("/study/lookup")}
                    >
                        <Text style={styles.studyButtonText}>Drug Lookup</Text>
                        <Text style={styles.buttonSubtext}>Search & Browse</Text>
                    </Pressable>

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
    },

    /* 🔑 Same vertical alignment trick as Home/Login */
    contentWrapper: {
        flex: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
        justifyContent: "center",
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

    options: {
        width: "100%",
        gap: spacing.sm,
        marginBottom: spacing.md,
    },

    /* 🔵 STUDY MODE BUTTONS */
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
    buttonSubtext: {
        fontSize: 12,
        color: colors.buttonText,
        opacity: 0.9,
        fontWeight: "500",
    },

    backButton: {
        backgroundColor: colors.accent,
        padding: spacing.md,
        borderRadius: 16,
        marginTop: spacing.sm,
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
