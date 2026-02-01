const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
    // esmExternals: 'loose',
  },
  
  // Transpile Supabase packages to fix ESM issues
  transpilePackages: ['@supabase/supabase-js'],
  
  webpack: (config, { isServer }) => {
    // Client-side: polyfill node modules and ignore server packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
      config.resolve.alias = {
        ...config.resolve.alias,
        'onnxruntime-node': false, 
      };
    }
    
    // Server-side: mock browser-only packages
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'face-api.js': false,
        'simple-peer': false,
        '@react-three/fiber': false,
        '@react-three/drei': false,
        'three': false,
        'pyodide': false,
        'onnxruntime-node': false,
        '@xenova/transformers': false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
