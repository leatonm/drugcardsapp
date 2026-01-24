import { Link } from "expo-router";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

const { width: screenWidth } = Dimensions.get("window");
const isMobile = screenWidth < 768;

export default function Contact() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Link href="/" asChild>
              <TouchableOpacity>
                <Text style={styles.backLink}>← Back to Home</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.title}>Contact Us</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Get in Touch</Text>
              <Text style={styles.description}>
                We'd love to hear from you. If you have any questions, concerns, or feedback about Mediccards, please don't hesitate to reach out to us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email</Text>
              <TouchableOpacity
                onPress={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = `mailto:drugcardapp@gmail.com`;
                  }
                }}
              >
                <Text style={styles.emailLink}>drugcardapp@gmail.com</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Response Time</Text>
              <Text style={styles.description}>
                We typically respond to all inquiries within 24-48 hours during business days.
              </Text>
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
    paddingHorizontal: isMobile ? spacing.md : spacing.xl,
    paddingVertical: isMobile ? spacing.lg : spacing.xl,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: isMobile ? spacing.lg : spacing.xl,
  },
  backLink: {
    fontSize: isMobile ? 14 : 16,
    color: colors.primary,
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  title: {
    fontSize: isMobile ? 28 : 36,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: isMobile ? spacing.lg : spacing.xl,
    backgroundColor: colors.surface,
    padding: isMobile ? spacing.md : spacing.xl,
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
  sectionTitle: {
    fontSize: isMobile ? 20 : 24,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    lineHeight: isMobile ? 20 : 24,
  },
  emailLink: {
    fontSize: isMobile ? 16 : 18,
    color: colors.accent,
    fontWeight: "500",
    textDecorationLine: "underline",
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

