import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = dirname(fileURLToPath(import.meta.url));

const apiProxyTarget =
  process.env.PROFORMA_API_URL ??
  process.env.NEXT_PUBLIC_PROFORMA_API_URL ??
  "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        destination: `${apiProxyTarget.replace(/\/$/, "")}/v1/:path*`,
        source: "/v1/:path*",
      },
    ];
  },
  turbopack: {
    root: appDirectory,
  },
};

export default nextConfig;
