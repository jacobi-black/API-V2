/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Optimisations de build
  compress: true,

  // Configuration pour la sortie standalone
  output: "standalone",

  // Optimisation des images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Configuration des headers HTTP
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Optimisation du bundle webpack
  webpack: (config, { dev, isServer }) => {
    // Utiliser Gzip en production
    if (!dev && !isServer) {
      // Suppression de moment.js des locales inutiles
      config.resolve.alias = {
        ...config.resolve.alias,
        moment$: "moment/moment.js",
      };

      // Ajouter d'autres optimisations webpack au besoin
    }

    return config;
  },
};

module.exports = nextConfig;
