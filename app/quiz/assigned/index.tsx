import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import { typography } from "../../../styles/typography";

export default function AssignedQuizScreen() {
    return (
        <View style={styles.container}>

            {/* 🟥 QUIZ MODE BANNER */}
            <View style={styles.modeBanner}>
                <Text style={styles.modeBannerText}>QUIZ MODE</Text>
            </View>

            <Text style={styles.title}>Instructor Assigned Quiz</Text>

            <Text style={styles.body}>
                No assigned quizzes are available yet.
                {"\n"}
                Your instructor can assign quizzes from the instructor portal.
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
        backgroundColor: colors.background,
        justifyContent: "flex-start",
    },

    /* 🟥 QUIZ MODE BANNER */
    modeBanner: {
        alignSelf: "center",
        backgroundColor: "#DC354544", // translucent red
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    modeBannerText: {
        color: colors.danger,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.1,
    },

    title: {
        ...typography.h1,
        textAlign: "center",
        color: colors.textPrimary,
        marginBottom: spacing.lg,
    },

    body: {
        ...typography.body,
        textAlign: "center",
        color: colors.textMuted,
        marginTop: spacing.lg,
        lineHeight: 22,
    },
});
