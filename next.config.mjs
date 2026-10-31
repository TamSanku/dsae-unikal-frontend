/** @type {import('next').NextConfig} */
const nextConfig = {
  // Les visuels des contenus viennent du backend DSAE (Render) : leurs adresses
  // sont absolues. On autorise ces images, sinon `next/image` refuse de les
  // servir et le déploiement échoue au rendu.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
