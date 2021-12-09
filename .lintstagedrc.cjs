module.exports = {
  '*.{js,cjs,mjs,ts,tsx}': 'yarn eslint --cache --fix', // Add '--max-warnings 0' back later
  '**/*.ts?(x)': () => 'yarn tsc --noEmit --incremental',
  '*.css': 'yarn stylelint --cache',
  '**/*': 'yarn pretty-quick --staged',
  '*.md': 'yarn markdownlint --config ./.markdownlint.json',
  Dockerfile: 'yarn dockerfilelint'
};
