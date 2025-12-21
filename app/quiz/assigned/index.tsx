// app/quiz/assigned/index.tsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { typography } from "../../../styles/typography";

export default function AssignedQuizScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* 🔽 CENTERED CONTENT BLOCK */}
            <View style={styles.contentWrapper}>
                {/* 🟥 QUIZ MODE BANNER */}
                <View style={styles.modeBanner}>
                    <Text style={styles.modeBannerText}>QUIZ MODE</Text>
                </View>

                <Text style={styles.title}>
                    Instructor Assigned Quiz
                </Text>

                <Text style={styles.body}>
                    No assigned quizzes are available yet.
                    {"\n"}
                    Your instructor can assign quizzes from the instructor portal.
                </Text>

                {/* Back → ALWAYS Quiz Index */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/quiz")}
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
    },

    /* 🔑 Matches Home / Study / Quiz alignment */
    contentWrapper: {
        flex: 1,
        padding: spacing.md,
        paddingHorizontal: spacing.lg,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
        justifyContent: "center",
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
        letterSpacing: 1.1,
        textAlign: "center",
    },

    title: {
        ...typography.h1,
        textAlign: "center",
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },

    body: {
        ...typography.body,
        textAlign: "center",
        color: colors.textMuted,
        lineHeight: 22,
        marginBottom: spacing.xl,
    },

    /* Back button */
    backButton: {
        backgroundColor: colors.accent,
        padding: spacing.md,
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
    },
});
