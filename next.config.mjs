/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Serve modern formats automatically; next/image will pick the best
    // one the requesting browser supports.
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
};

export default nextConfig;
