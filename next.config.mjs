/** @type {import('next').NextConfig} */
const nextConfig = {
    // Your existing shop settings, e.g., Supabase image domains
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: 'your-id.supabase.co',
        }, ],
    },
};

export default nextConfig;