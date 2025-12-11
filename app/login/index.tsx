
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { spacing } from "../../styles/spacing";
import { colors } from "../../styles/colors";

export default function LoginScreen() {

    const handleEnter = () => router.replace("/home");

    return (
        <View style={styles.container}>

            {/* Logo */}
            <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
            />

            {/* Enter Button */}
            <TouchableOpacity style={styles.button} onPress={handleEnter}>
                <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",

        // ⬅ shifts everything up from the true center
        paddingBottom: 120,
    },

    logo: {
    width: 250,
    height: 150,               // force correct height
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: spacing.xl,
},


    button: {
        width: 200,
        backgroundColor: colors.card,
        paddingVertical: spacing.md,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },

    buttonText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "600",
    },
});
