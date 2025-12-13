// hooks/useDrugs.ts
import { useEffect, useMemo, useState } from "react";
import type { UserScope } from "./useUserScope";

export type Drug = {
    id: string;
    scope: string[];
    name: { generic: string; brand: string[] };
    class: string;
    mechanism: string;
    indications: string[];
    contraindications: string[];
    adultDose: string;
    pediatricDose: string;
    routes: string[];
};

/**
 * Defines which drug files each scope is allowed to see.
 * Higher scopes inherit lower scopes automatically.
 */
const SCOPE_FILES: Record<UserScope, string[]> = {
    EMT: ["emt"],
    AEMT: ["emt", "aemt"],
    Paramedic: ["emt", "aemt", "paramedic"],
    RN: ["emt", "aemt", "paramedic", "rn"],
};

/**
 * Remote JSON file locations
 */
const FILE_URLS: Record<string, string> = {
    emt: "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/emt.json",
    aemt: "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/aemt.json",
    paramedic: "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/paramedic.json",
    rn: "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/rn.json",
};

/**
 * Removes duplicate drugs using generic name as the key.
 * First occurrence wins (lower scope versions take priority).
 */
function dedupeByGeneric(drugs: Drug[]) {
    const map = new Map<string, Drug>();

    for (const drug of drugs) {
        const key = drug.name.generic.trim().toLowerCase();
        if (!map.has(key)) {
            map.set(key, drug);
        }
    }

    return Array.from(map.values());
}

export function useDrugs(scope?: UserScope) {
    const [allDrugs, setAllDrugs] = useState<Record<string, Drug[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAll() {
            try {
                const entries = await Promise.all(
                    Object.entries(FILE_URLS).map(async ([key, url]) => {
                        const res = await fetch(url);
                        if (!res.ok) {
                            throw new Error(`Failed to fetch ${url}`);
                        }
                        const data: Drug[] = await res.json();
                        return [key, data] as const;
                    })
                );

                setAllDrugs(Object.fromEntries(entries));
            } catch (error) {
                console.error("Failed to load drug data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, []);

    const drugs = useMemo(() => {
        // 🛡 Guard against undefined scope on first render
        if (!scope) return [];

        const allowedFiles = SCOPE_FILES[scope] ?? [];

        const combined = allowedFiles.flatMap(
            fileKey => allDrugs[fileKey] ?? []
        );

        return dedupeByGeneric(combined);
    }, [allDrugs, scope]);

    return { drugs, loading };
}
