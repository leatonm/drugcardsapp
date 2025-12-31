import { Link } from "expo-router";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

export default function Index() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Mediccards</Text>
            <Text style={styles.subtitle}>
              Professional Medical Reference Application
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionText}>
                Mediccards is a professional medical reference application designed exclusively for healthcare professionals and medical students. This application serves as an educational and reference tool and is intended to supplement, not replace, established local and state medical protocols, guidelines, and institutional policies.
              </Text>
              <Text style={styles.descriptionText}>
                We are committed to maintaining the highest standards of privacy and data protection. Mediccards does not collect, store, or share any user data. All usage remains completely private and confidential, ensuring that your professional activities remain secure and protected.
              </Text>
              <Text style={styles.descriptionText}>
                This application is strictly intended for professional use by qualified healthcare professionals and should be used in conjunction with, and not as a substitute for, official medical protocols, state regulations, and institutional guidelines.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Link href="/contact" style={styles.button}>
                <Text style={styles.buttonText}>Contact Us</Text>
              </Link>

              <Link href="/privacy" style={styles.button}>
                <Text style={styles.buttonText}>Privacy Policy</Text>
              </Link>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Mediccards. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl * 2,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: colors.textMuted,
    textAlign: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionSection: {
    width: "100%",
    maxWidth: 800,
    marginBottom: spacing.xl * 2,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.md,
    textAlign: "left",
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.lg,
    maxWidth: 400,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.xl * 2,
    paddingTop: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
