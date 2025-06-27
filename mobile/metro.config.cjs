// const { getDefaultConfig } = require('expo/metro-config');
// const { withNativeWind } = require('nativewind/metro');

// module.exports = (() => {
//   const config = getDefaultConfig(__dirname);
//   const { resolver: { sourceExts, assetExts } } = config;

//   return {
//     ...withNativeWind(config, { input: './global.css' }),
//     resolver: {
//       ...config.resolver,
//       sourceExts: [...sourceExts, 'mjs'],
//     },
//   };
// })(); 

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname)

module.exports = withNativeWind(config, { input: './global.css' })