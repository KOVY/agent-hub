import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "cs", "de", "sk"],
  defaultLocale: "en",
});
