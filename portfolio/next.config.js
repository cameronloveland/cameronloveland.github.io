/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // Allows Next.js <Image> to work in static export
};
module.exports = nextConfig;
