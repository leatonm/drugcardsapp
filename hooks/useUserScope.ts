import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type UserScope = "EMT" | "AEMT" | "Paramedic" | "RN";

const STORAGE_KEY = "user_scope";

export function useUserScope() {
    // Default level is EMT (will be updated from user profile when login is implemented)
    const [scope, setScope] = useState<UserScope>("EMT");
    const [loading, setLoading] = useState(true);

    // Load on startup
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then(value => {
                if (value) setScope(value as UserScope);
            })
            .finally(() => setLoading(false));
    }, []);

    // Save whenever changed
    const updateScope = async (newScope: UserScope) => {
        setScope(newScope);
        await AsyncStorage.setItem(STORAGE_KEY, newScope);
    };

    return { scope, updateScope, loading };
}
