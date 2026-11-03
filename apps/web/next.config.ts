import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@yieldr/db", "@yieldr/engine"],
  poweredByHeader: false,
};

export default nextConfig;
