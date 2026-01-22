import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
    },
    cacheComponents: true,
};

export default nextConfig;
