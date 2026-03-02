"use client";

import { useTranslations } from "next-intl";
import { SERVER_CATEGORIES } from "@agent-hub/db";

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
          selected === ""
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
        }`}
      >
        {t("registry.allCategories")}
      </button>
      {SERVER_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
            selected === cat
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          }`}
        >
          {t(`categories.${cat}`)}
        </button>
      ))}
    </div>
  );
}
