import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // для статического экспорта
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
