// hooks/getDrugs.ts
import { useEffect, useMemo, useState } from "react";
import type { UserScope } from "./useUserScope";


export type Drug = {
    id: string;
    scope: string[];
    name: {
        generic: string;
        brand: string[];
    };
    class: string;
    mechanism: string;
    indications: string[];
    contraindications: string[];

    //Optional — not present on RN drugs
    adultDose?: string;
    pediatricDose?: string;
    routes?: string[];

    //RN-only fields
    interactions?: string[];
    education?: string[];
};


export function useDrugs(scope: UserScope) {
    const [allDrugs, setAllDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadData() {
            setError(null);
            setLoading(true);
            try {
                const urls = [
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/emt.json",
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/aemt.json",
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/paramedic.json",
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/rn.json",
                ];

                const responses = await Promise.all(
                    urls.map(url =>
                        fetch(url).then(res => {
                            if (!res.ok) {
                                throw new Error(`Failed to fetch ${url}`);
                            }
                            return res.json();
                        })
                    )
                );

                const combined: Drug[] = responses.flat();
                setAllDrugs(combined);
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Failed to load drug data");
                console.error("Failed to load drug data:", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Filter by scope - handle "ALL" case explicitly
    const drugs = useMemo(() => {
        if (scope === "ALL") {
            return allDrugs;
        }
        return allDrugs.filter(
            drug =>
                Array.isArray(drug.scope) &&
                drug.scope.includes(scope)
        );
    }, [allDrugs, scope]);

    return { drugs, loading, error };
}
