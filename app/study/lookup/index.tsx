import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useDrugs } from "../../../hooks/getDrugs";
import { useUserScope } from "../../../hooks/useUserScope";
import { colors } from "../../../styles/colors";
import { spacing } from "../../../styles/spacing";
import AppHeader from "../../../components/AppHeader";

export default function DrugLookup() {
  const router = useRouter();
  const { scope } = useUserScope();
  const { drugs, loading } = useDrugs(scope);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return drugs
      .filter((d) => {
        const generic = d?.name?.generic?.toLowerCase?.() ?? "";
        const brands = Array.isArray(d?.name?.brand) ? d.name.brand.join(" ").toLowerCase() : "";
        return generic.includes(q) || brands.includes(q);
      })
      .sort((a, b) => (a.name.generic ?? "").localeCompare(b.name.generic ?? ""));
  }, [drugs, query]);

  if (loading) {
    return <Text style={styles.loading}>Loading…</Text>;
  }

  return (
    <View style={styles.container}>

      {/* 🔹 HEADER ZONE */}
      <View style={styles.header}>
        <AppHeader />
      </View>

      {/* 🔹 MAIN CONTENT */}
      <View style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>DRUG LOOKUP</Text>
        </View>

        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search drug name…"
            placeholderTextColor={colors.textMuted}
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        <View style={styles.listWrapper}>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={styles.rowWrapper}>
                <Pressable
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { transform: [{ scale: 0.99 }], opacity: 0.9 },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/study/lookup/viewer",
                      params: { drug: JSON.stringify(item) },
                    })
                  }
                >
                  <Text style={styles.name}>{item.name.generic}</Text>
                  {!!item.name.brand?.length && (
                    <Text style={styles.brand}>
                      {item.name.brand.join(", ")}
                    </Text>
                  )}
                </Pressable>
              </View>
            )}

            ListEmptyComponent={
              <Text style={styles.empty}>
                No results. Try a different search.
              </Text>
            }
          />
        </View>
      </View>

      {/* 🔹 FOOTER */}
      <View style={styles.footer}>
        <Pressable
          style={styles.back}
          onPress={() => router.replace("/study")}
        >
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },

  header: {
    paddingTop: spacing.lg,     // 👈 pushes logo down naturally
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.lg,  // 👈 keeps Back button off screen edge
    alignItems: "center",
  },
  banner: {
    alignSelf: "center",
    backgroundColor: "#3DA5D944",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  bannerText: {
    color: "#3DA5D9",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.2,
    textAlign: "center",
  },

  search: {
    width: "100%",          // 👈 important
    maxWidth: 420,          // 👈 matches card width
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  listWrapper: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  searchWrapper: {
    width: "100%",
    alignItems: "center",
  },

  rowWrapper: {
    width: "100%",
    alignItems: "center",
  },

  row: {
    width: "100%",          // 👈 important
    maxWidth: 420,          // 👈 matches card width
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  // ✅ fixed contrast
  brand: {
    marginTop: 4,
    fontSize: 14,
    color: "#3DA5D9",
    opacity: 0.85,
    fontWeight: "500",
  },

  empty: {
    marginTop: spacing.lg,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 15,
  },

  back: {
    alignSelf: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
  },
  backText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: "700",
  },

  loading: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textPrimary,
  },
});
