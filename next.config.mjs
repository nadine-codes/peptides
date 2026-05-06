/** @type {import('next').NextConfig} */
const nextConfig = {
  // StrictMode double-mounts effects in dev, which would abort + re-launch
  // the SSE stream on every navigation — wasting Apify credits in live mode.
  reactStrictMode: false,
  experimental: {
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
