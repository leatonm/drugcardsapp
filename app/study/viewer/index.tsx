import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AdPlaceholder from "../../../components/AdPlaceholder";
import FlashCard from "../../../components/FlashCard";
import { useAuth } from "../../../hooks/useAuth";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export default function FlashcardViewer() {
    const router = useRouter();
    const { data } = useLocalSearchParams();
    const { user } = useAuth();

    const drugs = JSON.parse(data as string);
    const [index, setIndex] = useState(0);
    const [adVisible, setAdVisible] = useState(false);
    const [viewedCount, setViewedCount] = useState(0);

    const next = () => {
        if (index < drugs.length - 1) {
            const newIndex = index + 1;
            setIndex(newIndex);
            handleCardView(newIndex);
        }
    };
    const prev = () => {
        if (index > 0) {
            const newIndex = index - 1;
            setIndex(newIndex);
            handleCardView(newIndex);
        }
    };

    // Track card views and show ads for free users
    const handleCardView = (cardIndex: number) => {
        if (user.membershipTier === "premium") return; // No ads for premium

        const newCount = viewedCount + 1;
        setViewedCount(newCount);

        // Show ad after every 10 cards viewed
        if (newCount % 10 === 0) {
            setAdVisible(true);
        }
    };

    // Track initial view
    useEffect(() => {
        handleCardView(0);
    }, []);

    const closeAd = () => {
        setAdVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 🔽 GROUPED HEADER + CARD */}
                <View style={styles.studyBlock}>
                    <View style={styles.modeBanner}>
                        <Text style={styles.modeBannerText}>STUDY MODE</Text>
                    </View>

                    <FlashCard drug={drugs[index]} resetFlip />
                </View>

                {/* Navigation */}
                <View style={styles.controls}>
                    <Pressable
                        style={[styles.navButton, index === 0 && styles.disabled]}
                        onPress={prev}
                        disabled={index === 0}
                    >
                        <Text style={styles.navButtonText}>◀</Text>
                    </Pressable>

                    <View style={styles.counterContainer}>
                        <Text style={styles.counter}>
                            {index + 1} / {drugs.length}
                        </Text>
                    </View>

                    <Pressable
                        style={[
                            styles.navButton,
                            index === drugs.length - 1 && styles.disabled,
                        ]}
                        onPress={next}
                        disabled={index === drugs.length - 1}
                    >
                        <Text style={styles.navButtonText}>▶</Text>
                    </Pressable>
                </View>

                {/* Exit */}
                <Pressable
                    style={styles.exitButton}
                    onPress={() => router.replace("/study")}
                >
                    <Text style={styles.exitText}>Exit Study Session</Text>
                </Pressable>
            </ScrollView>

            {/* Ad Modal - Only for free users */}
            {user.membershipTier === "free" && (
                <AdPlaceholder visible={adVisible} onClose={closeAd} />
            )}
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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
        flexGrow: 1,
        maxWidth: 480,
        alignSelf: "center",
        width: "100%",
        alignItems: "center",
        minHeight: "100%",
        justifyContent: "center",
    },

    studyBlock: {
        width: "100%",
        alignItems: "stretch",
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },

    /* 🔵 STUDY MODE BANNER */
    modeBanner: {
        alignSelf: "center",
        backgroundColor: "#3D6A9F44",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xl,
        borderRadius: 20,
        marginBottom: spacing.md,
    },

    modeBannerText: {
        color: "#3D6A9F",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.2,
    },

    /* Center Flashcard vertically */
    centerSection: {
        flex: 1,
        justifyContent: "center",
    },

    cardWrapper: {
        height: 330,
        width: "100%",
        justifyContent: "center",
    },

    controls: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: spacing.lg,
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
        width: "100%",
    },

    navButton: {
        backgroundColor: "#3D6A9F",
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },

    navButtonText: {
        color: colors.buttonText,
        fontSize: 28,
        fontWeight: "900",
        lineHeight: 28,
        textAlign: "center",
        includeFontPadding: false,
        textAlignVertical: "center",
    },

    disabled: {
        opacity: 0.35,
    },

    counterContainer: {
        backgroundColor: "#3D6A9F22",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#3D6A9F",
        minWidth: 90,
    },
    counter: {
        fontSize: 16,
        fontWeight: "700",
        color: "#3D6A9F",
        textAlign: "center",
    },

    exitButton: {
        alignSelf: "center",
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: 16,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },

    exitText: {
        color: colors.buttonText,
        fontSize: 16,
        fontWeight: "700",
    },
});

