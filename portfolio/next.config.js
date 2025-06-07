/** @type {import('next').NextConfig} */
const nextConfig = {
 //output: 'export', // Uncomment this line if you want to export the app as a static site
  images: { unoptimized: true }, // Allows Next.js <Image> to work in static export
};
module.exports = nextConfig;
