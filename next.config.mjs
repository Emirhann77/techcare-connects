// GitHub Pages serves a project site under https://<user>.github.io/<repo>/,
// so assets must be prefixed with that subpath. The deploy workflow sets
// PAGES_BASE_PATH to "/<repo>"; locally it's empty so `npm run dev` still works.
const basePath = process.env.PAGES_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site (HTML/JS/CSS) in `out/` so it can be hosted
  // anywhere — GitHub Pages, Netlify, Vercel — and shared as a link.
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
