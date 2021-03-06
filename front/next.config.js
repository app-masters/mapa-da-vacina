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
    if (process.env.NEXT_PUBLIC_PREFECTURE_ID) {
      // Rewriting the root folder to the city page
      rewriteList = [
        {
          source: '/',
          destination: `/cidade/${process.env.NEXT_PUBLIC_PREFECTURE_ID}`
        }
      ];
    } else if (process.env.NEXT_PUBLIC_HEROKU) {
      console.log(process.env.NEXT_PUBLIC_HEROKU);
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

    console.log(rewriteList);

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
