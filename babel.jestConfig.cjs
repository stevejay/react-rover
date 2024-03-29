module.exports = {
  presets: [
    'babel-preset-vite',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { targets: { node: 'current' }, runtime: 'automatic' }],
    '@babel/preset-typescript'
  ]
};
