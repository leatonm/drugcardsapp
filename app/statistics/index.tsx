// app/statistics/index.tsx
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../../components/AppHeader";
import { useStatistics } from "../../hooks/useStatistics";
import { colors } from "../../styles/colors";
import { spacing } from "../../styles/spacing";
import { typography } from "../../styles/typography";

export default function StatisticsScreen() {
    const router = useRouter();
    const { stats, loading, resetStats } = useStatistics();

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "Never";
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.contentWrapper}>
                    <AppHeader />
                    <Text style={styles.loadingText}>Loading statistics...</Text>
                </View>
            </View>
        );
    }

    const hasNoData = stats.totalQuizzes === 0;

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <AppHeader />

                <Text style={styles.title}>Statistics</Text>

                {hasNoData ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            No quiz data yet.{"\n"}
                            Complete some quizzes to see your statistics!
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <View style={styles.cardsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
                                <Text style={styles.statLabel}>Quizzes</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{stats.totalQuestions}</Text>
                                <Text style={styles.statLabel}>Questions</Text>
                            </View>
                        </View>

                        {/* Main Stats */}
                        <View style={styles.mainStats}>
                            <View style={styles.mainStatCard}>
                                <Text style={styles.mainStatLabel}>Average Score</Text>
                                <Text style={styles.mainStatValue}>
                                    {stats.averageScore.toFixed(1)}%
                                </Text>
                            </View>

                            <View style={styles.mainStatCard}>
                                <Text style={styles.mainStatLabel}>Best Score</Text>
                                <Text style={styles.mainStatValue}>
                                    {stats.bestScore.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        {/* Detailed Stats */}
                        <View style={styles.detailCard}>
                            <Text style={styles.detailTitle}>Performance</Text>
                            
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Total Correct:</Text>
                                <Text style={styles.detailValue}>
                                    {stats.totalCorrect} / {stats.totalQuestions}
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Accuracy:</Text>
                                <Text style={styles.detailValue}>
                                    {stats.totalQuestions > 0
                                        ? ((stats.totalCorrect / stats.totalQuestions) * 100).toFixed(1)
                                        : "0.0"}%
                                </Text>
                            </View>

                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Last Quiz:</Text>
                                <Text style={styles.detailValue}>
                                    {formatDate(stats.lastQuizDate)}
                                </Text>
                            </View>
                        </View>

                        {/* Reset Button */}
                        <Pressable
                            style={styles.resetButton}
                            onPress={() => {
                                Alert.alert(
                                    "Reset Statistics",
                                    "Are you sure you want to reset all statistics? This cannot be undone.",
                                    [
                                        {
                                            text: "Cancel",
                                            style: "cancel",
                                        },
                                        {
                                            text: "Reset",
                                            style: "destructive",
                                            onPress: resetStats,
                                        },
                                    ]
                                );
                            }}
                        >
                            <Text style={styles.resetButtonText}>Reset Statistics</Text>
                        </Pressable>
                    </>
                )}

                {/* Back Button */}
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.replace("/home")}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2,
        maxWidth: 400,
        alignSelf: "center",
        width: "100%",
    },
    contentWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: colors.textMuted,
        marginTop: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: "800" as const,
        color: "#1A1A1A",
        textAlign: "center",
        marginBottom: spacing.xl,
    },
    emptyState: {
        backgroundColor: colors.card,
        padding: spacing.xl,
        borderRadius: 16,
        alignItems: "center",
        marginTop: spacing.xl,
    },
    emptyText: {
        ...typography.body,
        color: colors.textMuted,
        textAlign: "center",
        fontSize: 16,
    },
    cardsRow: {
        flexDirection: "row",
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        padding: spacing.lg,
        borderRadius: 16,
        alignItems: "center",
    },
    statValue: {
        fontSize: 32,
        fontWeight: "800",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.textMuted,
    },
    mainStats: {
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    mainStatCard: {
        backgroundColor: colors.card,
        padding: spacing.lg,
        borderRadius: 16,
        alignItems: "center",
    },
    mainStatLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    mainStatValue: {
        fontSize: 48,
        fontWeight: "900",
        color: colors.danger,
    },
    detailCard: {
        backgroundColor: colors.card,
        padding: spacing.lg,
        borderRadius: 16,
        marginBottom: spacing.lg,
    },
    detailTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.inputBorder,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.textMuted,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "700",
        color: colors.textPrimary,
    },
    resetButton: {
        backgroundColor: colors.danger,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: spacing.lg,
    },
    resetButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
    backButton: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
    },
    backButtonText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});

