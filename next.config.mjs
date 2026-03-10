/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '*.supabase.co', // Use * to catch any ID
        }, ],
    },
    // ADD THIS SECTION:
    async headers() {
        return [{
            source: '/gallery/:path*',
            headers: [{
                key: 'Cache-Control',
                value: 'public, max-age=31536000, immutable',
            }, ],
        }, ];
    },
};

export default nextConfig;