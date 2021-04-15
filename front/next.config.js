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
  }
};

module.exports = withPlugins([[withBundleAnalyzer]], nextBaseConfig);
