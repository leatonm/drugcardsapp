import { Link } from "expo-router";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

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
            <Text style={styles.lastUpdated}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Introduction</Text>
              <Text style={styles.description}>
                Welcome to Mediccards, a professional medical reference application designed exclusively for healthcare professionals and medical students. We are committed to protecting your privacy and maintaining the highest standards of data protection. This Privacy Policy explains our commitment to privacy and how we handle information related to our services.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Use Disclaimer</Text>
              <Text style={styles.description}>
                Mediccards is strictly intended for professional use by qualified healthcare professionals and medical students. This application serves as an educational and reference tool and is designed to supplement, not replace, established local and state medical protocols, guidelines, and institutional policies.
              </Text>
              <Text style={styles.description}>
                Users are advised that this application does not supersede or replace any local, state, or federal medical protocols, regulations, or institutional guidelines. All medical decisions should be made in accordance with applicable local and state regulations, institutional policies, and professional medical standards.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information We Collect</Text>
              <Text style={styles.description}>
                Mediccards is designed with privacy as a fundamental principle. We do not collect, store, or share any user data from the application itself. The application operates entirely locally on your device, ensuring complete privacy and confidentiality of your professional activities.
              </Text>
              <Text style={styles.description}>
                The only information we may collect is limited to:
              </Text>
              <Text style={styles.listItem}>
                • Contact information (name and email address) that you voluntarily provide when contacting us through our website contact form
              </Text>
              <Text style={styles.description}>
                We do not track your usage within the application, do not collect any medical or professional data, and do not store any information about your interactions with the application content.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How We Use Your Information</Text>
              <Text style={styles.description}>
                Since Mediccards does not collect or store any user data from the application, there is no user data to use, share, or analyze. The application operates completely independently on your device.
              </Text>
              <Text style={styles.description}>
                Any contact information you voluntarily provide through our website contact form is used solely for the purpose of:
              </Text>
              <Text style={styles.listItem}>
                • Responding to your inquiries and providing customer support
              </Text>
              <Text style={styles.listItem}>
                • Addressing technical issues or questions you may have
              </Text>
              <Text style={styles.description}>
                We do not use contact information for marketing purposes, and we do not share this information with any third parties.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Information Sharing and Disclosure</Text>
              <Text style={styles.description}>
                Mediccards does not share, sell, trade, or disclose any user data because we do not collect or store any user data from the application. Your professional activities, usage patterns, and any interactions with the application content remain completely private and confidential on your device.
              </Text>
              <Text style={styles.description}>
                Any contact information provided through our website is kept strictly confidential and is never shared with third parties, except in the following limited circumstances:
              </Text>
              <Text style={styles.listItem}>
                • When required by law or to comply with legal obligations
              </Text>
              <Text style={styles.listItem}>
                • To protect and defend our rights or property in legal proceedings
              </Text>
              <Text style={styles.description}>
                We do not use third-party service providers that would have access to any user data, as no such data is collected.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Security and Privacy</Text>
              <Text style={styles.description}>
                Since Mediccards does not collect, transmit, or store any user data, your privacy is inherently protected. All application data remains on your device and is never transmitted to our servers or any third-party services.
              </Text>
              <Text style={styles.description}>
                For any contact information you voluntarily provide through our website, we implement appropriate technical and organizational security measures to protect this information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Rights</Text>
              <Text style={styles.description}>
                You have the right to:
              </Text>
              <Text style={styles.listItem}>
                • Access and receive a copy of your personal information
              </Text>
              <Text style={styles.listItem}>
                • Request correction of inaccurate personal information
              </Text>
              <Text style={styles.listItem}>
                • Request deletion of your personal information
              </Text>
              <Text style={styles.listItem}>
                • Object to processing of your personal information
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cookies and Tracking Technologies</Text>
              <Text style={styles.description}>
                The Mediccards application itself does not use cookies, tracking technologies, or any analytics tools. The application operates entirely locally on your device without any tracking or monitoring capabilities.
              </Text>
              <Text style={styles.description}>
                Our website may use minimal cookies for basic functionality, but we do not use tracking cookies or analytics tools that would monitor your behavior. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Children's Privacy</Text>
              <Text style={styles.description}>
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
              <Text style={styles.description}>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
              <Text style={styles.description}>
                If you have any questions about this Privacy Policy, please contact us at:
              </Text>
              <Text style={styles.emailText}>drugcardapp@gmail.com</Text>
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
    marginBottom: spacing.xl,
  },
  backLink: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.primary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  listItem: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 24,
    marginLeft: spacing.md,
    marginBottom: spacing.xs,
  },
  emailText: {
    fontSize: 16,
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

