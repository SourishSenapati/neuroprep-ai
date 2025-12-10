/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    
    // Support for Pyodide
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource'
    });
    
    return config;
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cross-Origin-Embedder-Policy',
          value: 'require-corp'
        },
        {
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin'
        }
      ]
    }
  ],
  rewrites: async () => [
    {
      source: '/api/:path((?!auth).*)',
      destination: 'http://localhost:5000/api/:path*'
    }
  ]
};

module.exports = nextConfig;
