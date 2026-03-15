import { Link } from "expo-router";
import { StyleSheet, Text, View, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.leatonmitchell.drugcardsapp";
const APP_STORE_URL = "https://apps.apple.com/us/app/medicards-drug-card-app/id6759225487";

const { width: screenWidth } = Dimensions.get("window");
const isMobile = screenWidth < 768;

export default function Index() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
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

            {/* Screenshots */}
            <View style={styles.screenshotRow}>
              <Image
                source={require("../assets/Screenshot1.png")}
                style={styles.screenshot}
                resizeMode="cover"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.appStoreButton]}
                onPress={() => Linking.openURL(APP_STORE_URL)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Download on the App Store</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.googlePlayButton]}
                onPress={() => Linking.openURL(GOOGLE_PLAY_URL)}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Get it on Google Play</Text>
              </TouchableOpacity>

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
    paddingHorizontal: isMobile ? spacing.md : spacing.xl,
    paddingVertical: isMobile ? spacing.lg : spacing.xl,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginTop: isMobile ? spacing.xl : spacing.xl * 2,
    marginBottom: isMobile ? spacing.xl : spacing.xl * 2,
  },
  logo: {
    width: isMobile ? 120 : 160,
    height: isMobile ? 120 : 160,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: isMobile ? 32 : 48,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: isMobile ? 16 : 18,
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
    marginBottom: isMobile ? spacing.xl : spacing.xl * 2,
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
  descriptionText: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    lineHeight: isMobile ? 20 : 24,
    marginBottom: spacing.md,
    textAlign: "left",
  },
  screenshotRow: {
    marginBottom: spacing.xl * 3,
    alignItems: "center",
    width: "100%",
  },
  screenshot: {
    width: isMobile ? Math.min(screenWidth - spacing.xl * 2, 500) : 500,
    height: isMobile ? (Math.min(screenWidth - spacing.xl * 2, 500) * 0.6) : 300,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.lg,
    maxWidth: 400,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: isMobile ? spacing.md : spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: isMobile ? 48 : 56,
  },
  appStoreButton: {
    backgroundColor: "#000000",
  },
  googlePlayButton: {
    backgroundColor: "#0D1B2A",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: isMobile ? 16 : 18,
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
