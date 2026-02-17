import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/gen-ui-demo",
  images: { unoptimized: true },
};

export default nextConfig;
