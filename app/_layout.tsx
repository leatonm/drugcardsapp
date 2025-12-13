import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.container}>
        {/* App navigation */}
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login/index" />
            <Stack.Screen name="home/index" />
            <Stack.Screen name="study/index" />
            <Stack.Screen name="quiz/index" />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal" }}
            />
          </Stack>
        </View>

        {/* Global footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            A product of Lauren Shuda & Leaton Mitchell
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },

  footer: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },

  footerText: {
    fontSize: 12,
    color: colors.textMuted,
    opacity: 0.8,
  },
});

