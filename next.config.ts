import type { NextConfig } from "next";

const r2Hostname = `${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

const nextConfig: NextConfig = {
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'source.unsplash.com' },
    { protocol: 'https', hostname: 'plus.unsplash.com' },
    { protocol: 'https', hostname: r2Hostname },
  ],
}

};

export default nextConfig;
