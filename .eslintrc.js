module.exports = {
  plugins: [
    'ember'
  ],
  globals: {
  },
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  parser: "babel-eslint",
  "parserOptions": {
    "sourceType": "module",
    "allowImportExportEverywhere": false,
    "codeFrame": true
  },
  rules: {
    "comma-dangle": ["error", "never"],
    "max-len": ["error", { code: 120 }],
    "lines-between-class-members": "off",
    "prefer-destructuring": "off",
    "space-before-function-paren": "off",
    "array-callback-return": "off",
    "func-names": "off",
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "no-underscore-dangle": "off",
    "no-continue": "off",
    "no-console": "off",
    "no-plusplus": "off",
    "no-param-reassign": "off",
    "ember/no-attrs-in-components": "off",
    "padded-blocks": ["error", { "classes": "never" }]
  }
};
