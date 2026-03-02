import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'domkakdom.storage.yandexcloud.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '10.17.75.147',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      }
    ],
  },
};

export default nextConfig;
