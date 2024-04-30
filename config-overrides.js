const { getBabelLoader } = require('customize-cra');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  getBabelLoader(config).options.presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ];

  getBabelLoader(config).options.plugins = [
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }]
  ];

  return config;
};
