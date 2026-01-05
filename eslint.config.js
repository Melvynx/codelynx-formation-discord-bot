import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  stylistic: {
    quotes: "double",
    semi: true,
  },
  typescript: true,
}, {
  rules: {
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": "off",
    "style/quote-props": "off",
    "style/operator-linebreak": "off",
    "style/arrow-parens": "off",
  },
}, {
  files: ["**/*.ts"],
  rules: {
    "no-throw-literal": "off",
    "prefer-promise-reject-errors": "off",
  },
});
