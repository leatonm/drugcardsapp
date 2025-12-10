import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserScope = "ALL" | "EMT" | "Paramedic" | "RN";

const STORAGE_KEY = "user_scope";

export function useUserScope() {
    const [scope, setScope] = useState<UserScope>("ALL");
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
