// hooks/getDrugs.ts
import { useState, useEffect, useMemo } from "react";
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

export function useDrugs(scope?: UserScope) {
    const [allDrugs, setAllDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const urls = [
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/emt.json",
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/paramedic.json",
                    "https://raw.githubusercontent.com/leatonm/drug-cards-data/main/rn.json",
                ];

                const requests = urls.map(url =>
                    fetch(url).then(res => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch ${url}`);
                        }
                        return res.json();
                    })
                );

                const [emt, paramedic, rn] = await Promise.all(requests);

                // Merge into one big array like before
                const combined: Drug[] = [...emt, ...paramedic, ...rn];

                setAllDrugs(combined);
            } catch (err) {
                console.error("Failed to fetch drug files:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // 🔎 Apply scope filter (EMT / Paramedic / RN / ALL)
    const drugs = useMemo(() => {
        if (!scope || scope === "ALL") return allDrugs;
        return allDrugs.filter(d => d.scope?.includes(scope));
    }, [allDrugs, scope]);

    return { drugs, loading };
}
