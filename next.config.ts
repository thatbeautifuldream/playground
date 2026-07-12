import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@codemirror/view",
      "@codemirror/state",
      "@codemirror/commands",
      "@codemirror/lang-javascript",
      "@codemirror/language",
      "@codemirror/autocomplete",
      "@codemirror/search",
      "@codemirror/lint",
      "@codemirror/theme-one-dark",
      "@uiw/react-codemirror",
    ],
  },
};

export default nextConfig;
