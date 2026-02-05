/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  transpilePackages: ['react-quill'],
  images: {
    domains: ['fonts.gstatic.com', 'localhost'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    // Disabled optimizeCss - causes OOM on Vercel builds
    // optimizeCss: true,
    optimizePackageImports: ['react-icons', 'lucide-react', 'framer-motion'],
    serverComponentsExternalPackages: ['puppeteer', '@react-pdf/renderer'],
    instrumentationHook: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'app'],
  },
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      // ONLY apply string-replace to @react-pdf packages, not all node_modules
      // This prevents breaking other packages like object-hash
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules[\\/]@react-pdf/,
        use: {
          loader: 'string-replace-loader',
          options: {
            search: /\bself\b/g,
            replace: '(typeof self !== "undefined" ? self : globalThis)',
          },
        },
      });

      // Disable splitChunks on server to prevent vendors.js creation
      config.optimization.splitChunks = false;

      // Add banner polyfill to every chunk
      config.plugins.push(
        new webpack.BannerPlugin({
          banner: 'if(typeof self==="undefined"){var self=globalThis;}',
          raw: true,
          entryOnly: false,
        })
      );
    } else {
      // Client-side: optimize bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          pdf: {
            test: /[\\/]@react-pdf[\\/]/,
            name: 'pdf',
            priority: 20,
            chunks: 'async',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
            chunks: 'all',
          },
        },
      };
    }

    // Optimize for production
    if (!dev) {
      config.optimization.minimize = true;
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/cv-builder',
        destination: '/builder',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
