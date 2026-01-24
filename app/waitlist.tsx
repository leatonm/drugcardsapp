import { Link } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

const { width: screenWidth } = Dimensions.get("window");
const isMobile = screenWidth < 768;

// TODO: Replace this with your deployed Google Apps Script URL.
// Example: const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw1pQTn89ctOKmP7VG4VcNIdfx2akPQiBSP2CqzC_YkDGtAgJILj8kL16_t0cL3Oniu/exec";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinWaitlist = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!GOOGLE_SCRIPT_URL) {
      Alert.alert(
        "Not Configured",
        "The waitlist backend is not configured yet. Please add your Google Apps Script URL in the code."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: new URLSearchParams({
          email: trimmed,
          source: "mediccards-waitlist",
        }).toString(),
      });

      // Google Apps Script may return text or JSON
      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response text:", responseText);

      // Handle response - Google Apps Script typically returns text or JSON
      if (response.ok) {
        // Try to parse as JSON first
        let data;
        try {
          data = JSON.parse(responseText);
        } catch {
          // If not JSON, treat plain text response as success
          data = { status: "success" };
        }

        // Check if response indicates success (either JSON with status: "success" or plain text)
        if (data && (data.status === "success" || responseText.toLowerCase().includes("success"))) {
          Alert.alert(
            "You're on the list!",
            "We'll email you when Mediccards is live on Google Play."
          );
          setEmail("");
        } else {
          Alert.alert(
            "Something went wrong",
            data?.message || responseText || "We couldn't save your email right now. Please try again in a moment."
          );
        }
      } else {
        // Non-OK response status
        Alert.alert(
          "Something went wrong",
          responseText || "We couldn't save your email right now. Please try again in a moment."
        );
      }
    } catch (error) {
      console.error("Error submitting waitlist email:", error);
      Alert.alert(
        "Network error",
        `Unable to submit your email: ${error instanceof Error ? error.message : "Unknown error"}. Please check your connection and try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Android Waiting List</Text>
            <Text style={styles.subtitle}>
              Be the first to know when Mediccards is live on Google Play.
            </Text>
          </View>

          {/* Screenshots */}
          <View style={styles.screenshotRow}>
            <Image
              source={require("../assets/Screenshot2.png")}
              style={styles.screenshot}
              resizeMode="cover"
            />
            <Image
              source={require("../assets/Screenshot3.png")}
              style={styles.screenshot}
              resizeMode="cover"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Join the waiting list</Text>
            <Text style={styles.cardText}>
              Enter your email and we'll send you a notification as soon as the
              Android app is available on Google Play.
            </Text>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
            />

            <TouchableOpacity
              style={[styles.button, isSubmitting && styles.buttonDisabled]}
              onPress={isSubmitting ? undefined : handleJoinWaitlist}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Notify Me"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.smallPrint}>
              We respect your privacy. Your email will only be used to send a
              launch notification for Mediccards on Android.
            </Text>
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
    alignItems: "center",
  },
  backLink: {
    fontSize: isMobile ? 14 : 16,
    color: colors.primary,
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  logo: {
    width: isMobile ? 100 : 140,
    height: isMobile ? 100 : 140,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: isMobile ? 24 : 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  screenshotRow: {
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  screenshot: {
    width: isMobile ? Math.min((screenWidth - spacing.xl * 2) * 0.45, 200) : 220,
    height: isMobile ? Math.min((screenWidth - spacing.xl * 2) * 0.9, 400) : 440,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.surface,
    padding: isMobile ? spacing.md : spacing.xl,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: isMobile ? 20 : 22,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: isMobile ? 20 : 22,
  },
  label: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: isMobile ? 14 : 16,
    color: colors.primary,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: isMobile ? spacing.md : spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: isMobile ? 14 : 16,
    fontWeight: "600",
  },
  smallPrint: {
    fontSize: isMobile ? 11 : 12,
    color: colors.textMuted,
    lineHeight: isMobile ? 16 : 18,
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

