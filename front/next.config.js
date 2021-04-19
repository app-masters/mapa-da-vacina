const withPlugins = require('next-compose-plugins');
// const withPWA = require('next-pwa');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const nextBaseConfig = {
  /**
   * Base webpack config
   * @param {*} config webpack base config
   */
  webpack: (config) => {
    return config;
  },
  images: {
    domains: ['firebasestorage.googleapis.com']
  },
  /**
   * Adding rewrite paths
   */
  async rewrites() {
    let rewriteList = [];
    if (process.env.NEXT_PUBLIC_HEROKU) {
      rewriteList = JSON.parse(process.env.NEXT_PUBLIC_HEROKU).map((item) => ({
        source: '/',
        has: [
          {
            type: 'host',
            value: `${item}.mapadavacina.com.br`
          }
        ],
        destination: `/cidade/${item}`
      }));
    }

    return [
      ...rewriteList,
      {
        // Fallback
        source: '/',
        destination: '/cidade/new'
      }
    ];
  }
};

module.exports = withPlugins([[withBundleAnalyzer]], nextBaseConfig);
