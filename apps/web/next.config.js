/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    API_URL: process.env.API_URL,
  },
  transpilePackages: ['@repo/ui'],
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
