// GitHub Pages serves a project site under https://<user>.github.io/<repo>/,
// so assets must be prefixed with that subpath. The deploy workflow sets
// PAGES_BASE_PATH to "/<repo>"; locally it's empty so `npm run dev` still works.
const basePath = process.env.PAGES_BASE_PATH || "";
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export ONLY for production builds (`npm run build`).
  // Keeping this off during `next dev` prevents broken CSS / 404 asset bugs.
  ...(staticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
  basePath,
  assetPrefix: basePath || undefined,
  webpack: (config, { dev }) => {
    // Avoid corrupted webpack pack files when .next is touched mid-session.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
