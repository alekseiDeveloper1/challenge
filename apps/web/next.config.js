const path = require('path');
module.exports = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone', // или 'export'
  experimental: {
    outputFileTracingIgnores: ['**canvas**'], // Опционально: исключения
  },
  eslint: {
    dirs: ['src']
  },
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};
