// components/AppHeader.tsx
import { View, Image, StyleSheet } from "react-native";
import { spacing } from "../styles/spacing";
import { colors } from "../styles/colors";

interface AppHeaderProps {
    logoWidth?: number;
    logoHeight?: number;
    topSpacing?: number;
    bottomSpacing?: number;     // NEW – space between header and content
}

export default function AppHeader({
    logoWidth,
    logoHeight,
    topSpacing,
    bottomSpacing,
}: AppHeaderProps) {

    return (
        <View
            style={[
                styles.container,
                topSpacing !== undefined && { paddingTop: topSpacing },
                bottomSpacing !== undefined && { paddingBottom: bottomSpacing }
            ]}
        >
            <Image
                source={require("../assets/logo.png")}
                style={[
                    styles.logo,
                    logoWidth && { width: logoWidth },
                    logoHeight && { height: logoHeight },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingTop: spacing.lg,        // more breathing room by default
        paddingBottom: spacing.lg,     // NEW default spacing under logo
        backgroundColor: colors.background,
        alignItems: "center",
    },
    logo: {
        width: 300,                    // smaller default size
        height: undefined,
        aspectRatio: 934 / 253,
        resizeMode: "contain",
    },
});
