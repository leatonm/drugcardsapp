// hooks/useAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type MembershipTier = "free" | "premium";

export type User = {
    isLoggedIn: boolean;
    email?: string;
    membershipTier: MembershipTier;
};

const AUTH_KEY = "user_auth";
const MEMBERSHIP_KEY = "user_membership";

export function useAuth() {
    const [user, setUser] = useState<User>({
        isLoggedIn: false,
        membershipTier: "free",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAuthState();
    }, []);

    async function loadAuthState() {
        try {
            const [authData, membership] = await Promise.all([
                AsyncStorage.getItem(AUTH_KEY),
                AsyncStorage.getItem(MEMBERSHIP_KEY),
            ]);

            if (authData) {
                const parsed = JSON.parse(authData);
                setUser({
                    isLoggedIn: parsed.isLoggedIn || false,
                    email: parsed.email,
                    membershipTier: (membership as MembershipTier) || "free",
                });
            }
        } catch (error) {
            console.error("Failed to load auth state:", error);
        } finally {
            setLoading(false);
        }
    }

    async function login(email: string) {
        try {
            const userData = {
                isLoggedIn: true,
                email,
            };
            await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(userData));
            setUser({
                isLoggedIn: true,
                email,
                membershipTier: "free", // Default to free, can be upgraded later
            });
        } catch (error) {
            console.error("Failed to login:", error);
        }
    }

    async function logout() {
        try {
            await AsyncStorage.removeItem(AUTH_KEY);
            setUser({
                isLoggedIn: false,
                membershipTier: "free",
            });
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    }

    async function upgradeToPremium() {
        try {
            await AsyncStorage.setItem(MEMBERSHIP_KEY, "premium");
            setUser((prev) => ({
                ...prev,
                membershipTier: "premium",
            }));
        } catch (error) {
            console.error("Failed to upgrade:", error);
        }
    }

    return {
        user,
        loading,
        login,
        logout,
        upgradeToPremium,
    };
}




