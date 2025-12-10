import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => router.replace("/home");

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
            />

            {/* Disabled Inputs */}
            <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Email (disabled)"
                value={email}
                editable={false}
                placeholderTextColor={colors.textMuted}
            />

            <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="Password (disabled)"
                value={password}
                editable={false}
                placeholderTextColor={colors.textMuted}
            />

            {/* Login Button */}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Enter App</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: colors.background,
    },

    logo: {
        width: 250,
        height: undefined,
        aspectRatio: 934 / 253,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: spacing.lg,
    },

    input: {
        width: 250,
        borderWidth: 1,
        borderColor: colors.textMuted + "55",
        borderRadius: 12,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm,
        fontSize: 16,
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },

    disabledInput: {
        backgroundColor: "#CCC",       // gray-out background
        color: "#666",                 // muted text
        borderColor: "#AAA",
        opacity: 0.7,                  // faint
    },

    button: {
        width: 250,
        backgroundColor: colors.card,
        paddingVertical: spacing.md,
        borderRadius: 16,
        marginTop: spacing.md,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        alignItems: "center",
    },

    buttonText: {
        textAlign: "center",
        fontSize: 16,
        color: colors.textPrimary,
        fontWeight: "600",
    },
});
