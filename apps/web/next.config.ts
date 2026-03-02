import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@agent-hub/ui", "@agent-hub/db", "@agent-hub/mcp"],
};

export default withNextIntl(nextConfig);
