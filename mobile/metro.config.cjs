const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { resolver: { sourceExts, assetExts } } = config;

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...sourceExts, 'mjs'],
    },
  };
})(); 