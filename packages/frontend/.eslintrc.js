module.exports = {
  extends: ['next/core-web-vitals', '../../.eslintrc.js'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // Next.js specific rules
    '@next/next/no-html-link-for-pages': 'off',
  },
  ignorePatterns: ['.eslintrc.js'],
};
