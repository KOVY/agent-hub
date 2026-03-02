"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServerCard } from "@/components/server-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchBar } from "@/components/search-bar";
import type { McpServer } from "@agent-hub/db";

export function RegistryContent({
  initialServers,
}: {
  initialServers: McpServer[];
}) {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredServers = useMemo(() => {
    return initialServers.filter((server) => {
      const matchesSearch =
        !search ||
        server.name.toLowerCase().includes(search.toLowerCase()) ||
        server.description.toLowerCase().includes(search.toLowerCase()) ||
        server.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory = !category || server.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category, initialServers]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gradient-text">{t("registry.title")}</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg">
              {t("registry.subtitle")}
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryFilter selected={category} onSelect={setCategory} />
          </div>

          {/* Results */}
          {filteredServers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {t("registry.noResults")}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
