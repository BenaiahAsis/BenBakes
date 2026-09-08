import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage CDN — replace YOUR_PROJECT_REF with your actual project ref
        // e.g. if your URL is https://abcdefghijklmnop.supabase.co, the ref is abcdefghijklmnop
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
