import { Link } from "expo-router";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

const { width: screenWidth } = Dimensions.get("window");
const isMobile = screenWidth < 768;

export default function Privacy() {
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
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Effective Date: February 20, 2026</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.description}>
                Medicards ("we," "our," or "us") operates the Medicards mobile application (the "App"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the App.
              </Text>
              <Text style={styles.description}>
                Medicards is an educational drug-learning application created for EMTs, AEMTs, Paramedics, RNs, and healthcare students. The App is for educational purposes only and does not provide medical advice or store patient health information.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Information We Collect</Text>
              <Text style={styles.description}>We collect the following types of information:</Text>
              <Text style={styles.subsectionTitle}>Account Information</Text>
              <Text style={styles.listItem}>• Email address</Text>
              <Text style={styles.listItem}>• Authentication credentials (managed securely through Firebase Authentication)</Text>
              <Text style={styles.subsectionTitle}>Usage & Progress Data</Text>
              <Text style={styles.listItem}>• Quiz scores</Text>
              <Text style={styles.listItem}>• Accuracy statistics</Text>
              <Text style={styles.listItem}>• Study progress</Text>
              <Text style={styles.listItem}>• Selected credential level (EMT, AEMT, Paramedic, RN)</Text>
              <Text style={styles.listItem}>• App activity necessary to provide functionality</Text>
              <Text style={styles.subsectionTitle}>Subscription Information</Text>
              <Text style={styles.description}>If you purchase Medicards Premium:</Text>
              <Text style={styles.listItem}>• Subscription status</Text>
              <Text style={styles.listItem}>• Purchase validation data from Apple</Text>
              <Text style={styles.description}>We do not collect or store payment information. All payments are processed by Apple through the App Store.</Text>
              <Text style={styles.subsectionTitle}>Advertising Data (Free Users)</Text>
              <Text style={styles.description}>If you use the free version of the App, advertisements may be displayed. Our advertising provider (Google AdMob) may collect device identifiers and usage information in accordance with Google's Privacy Policy.</Text>
              <Text style={styles.subsectionTitle}>Information We Do NOT Collect</Text>
              <Text style={styles.listItem}>• We do not collect patient data.</Text>
              <Text style={styles.listItem}>• We do not collect protected health information (PHI).</Text>
              <Text style={styles.listItem}>• We do not store medical records.</Text>
              <Text style={styles.listItem}>• We do not collect precise location data.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
              <Text style={styles.description}>We use the information we collect to:</Text>
              <Text style={styles.listItem}>• Create and manage your account</Text>
              <Text style={styles.listItem}>• Authenticate users securely</Text>
              <Text style={styles.listItem}>• Store and sync quiz progress across devices</Text>
              <Text style={styles.listItem}>• Provide subscription access to premium features</Text>
              <Text style={styles.listItem}>• Improve app functionality</Text>
              <Text style={styles.listItem}>• Display advertisements to free users</Text>
              <Text style={styles.listItem}>• Respond to support requests</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Third-Party Services</Text>
              <Text style={styles.description}>We use trusted third-party services to operate the App:</Text>
              <Text style={styles.subsectionTitle}>Firebase (Google)</Text>
              <Text style={styles.description}>We use Firebase services for:</Text>
              <Text style={styles.listItem}>• User authentication</Text>
              <Text style={styles.listItem}>• Secure data storage</Text>
              <Text style={styles.listItem}>• Backend infrastructure</Text>
              <Text style={styles.description}>Firebase may process data in accordance with Google's Privacy Policy.</Text>
              <Text style={styles.subsectionTitle}>Apple</Text>
              <Text style={styles.description}>Subscription payments are processed entirely by Apple. We do not have access to or store your payment details.</Text>
              <Text style={styles.subsectionTitle}>Google AdMob</Text>
              <Text style={styles.description}>We use Google AdMob to display advertisements in the free version of the App. AdMob may collect device identifiers and usage data as described in Google's Privacy Policy.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Data Storage & Security</Text>
              <Text style={styles.description}>We use commercially reasonable safeguards to protect your information. User account data and progress data are stored securely using Firebase services.</Text>
              <Text style={styles.description}>While we strive to protect your information, no system can guarantee absolute security.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Data Retention</Text>
              <Text style={styles.description}>We retain user account and progress data for as long as your account remains active.</Text>
              <Text style={styles.description}>You may request deletion of your account and associated data at any time by contacting:</Text>
              <Text style={styles.emailText}>drugcardapp@gmail.com</Text>
              <Text style={styles.description}>Upon verified request, we will delete your account and associated data within a reasonable timeframe.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>6. Your Rights</Text>
              <Text style={styles.description}>Depending on your location, you may have rights regarding your personal information, including:</Text>
              <Text style={styles.listItem}>• Accessing your data</Text>
              <Text style={styles.listItem}>• Correcting inaccurate data</Text>
              <Text style={styles.listItem}>• Requesting deletion of your data</Text>
              <Text style={styles.description}>To exercise these rights, contact us at:</Text>
              <Text style={styles.emailText}>drugcardapp@gmail.com</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
              <Text style={styles.description}>Medicards is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</Text>
              <Text style={styles.description}>If we become aware that such information has been collected, we will delete it promptly.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. Educational & Medical Disclaimer</Text>
              <Text style={styles.description}>Medicards is intended for educational and training purposes only. It does not provide medical advice, diagnosis, or treatment.</Text>
              <Text style={styles.description}>Users should rely on their clinical training, professional judgment, and official medical guidelines when making patient care decisions.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
              <Text style={styles.description}>We may update this Privacy Policy from time to time. When we do, we will update the "Effective Date" at the top of this page.</Text>
              <Text style={styles.description}>Continued use of the App after changes are made constitutes acceptance of the updated policy.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>10. Contact Us</Text>
              <Text style={styles.description}>If you have any questions about this Privacy Policy, you may contact us at:</Text>
              <Text style={styles.emailText}>Email: drugcardapp@gmail.com</Text>
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
    marginBottom: spacing.sm,
  },
  lastUpdated: {
    fontSize: isMobile ? 12 : 14,
    color: colors.textMuted,
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
  subsectionTitle: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: "600",
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    lineHeight: isMobile ? 20 : 24,
    marginBottom: spacing.sm,
  },
  listItem: {
    fontSize: isMobile ? 14 : 16,
    color: colors.textMuted,
    lineHeight: isMobile ? 20 : 24,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  emailText: {
    fontSize: isMobile ? 14 : 16,
    color: colors.accent,
    fontWeight: "500",
    marginTop: spacing.sm,
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
