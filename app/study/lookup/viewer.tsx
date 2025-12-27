import { View, StyleSheet, Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import FlashCard from "../../../components/FlashCard";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";

export default function LookupViewer() {
  const router = useRouter();
  const { drug } = useLocalSearchParams();

  const parsed = JSON.parse(drug as string);

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>DRUG LOOKUP</Text>
        </View>

        <FlashCard drug={parsed} />

        <Pressable
          style={styles.back}
          onPress={() => router.replace("/study/lookup")}
        >
          <Text style={styles.backText}>Back to List</Text>
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
  contentWrapper: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    alignSelf: "center",
    backgroundColor: "#3DA5D944",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  bannerText: {
    color: "#3DA5D9",
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  back: {
    alignSelf: "center",
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
  },
  backText: {
    color: colors.buttonText,
    fontWeight: "700",
  },
});
