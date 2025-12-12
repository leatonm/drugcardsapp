// components/AppHeader.tsx
import { View, Image, StyleSheet } from "react-native";
import { spacing } from "../styles/spacing";
import { colors } from "../styles/colors";

interface AppHeaderProps {
    logoWidth?: number;
    logoHeight?: number;
    topSpacing?: number;
    bottomSpacing?: number;
}

export default function AppHeader({
    logoWidth = 250,
    logoHeight = 150,
}: AppHeaderProps) {
    return (
        <View style={{ alignItems: "center", marginBottom: spacing.xl }}>
            <Image
                source={require("../assets/logo.png")}
                style={{
                    width: logoWidth,
                    height: logoHeight,
                    resizeMode: "contain",
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: colors.background,
        alignItems: "center",
    },
});
