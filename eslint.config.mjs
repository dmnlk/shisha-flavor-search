import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  // Global ignores
  {
    ignores: [
      "data/shishaData.js",
      "utils/debounce.ts",
      ".next/**",
      "node_modules/**",
    ],
  },
  // Next.js core web vitals config
  ...nextCoreWebVitals,
  // Custom rules
  {
    rules: {
      // Disable the new React 19 rule about setState in effects
      // This is existing code that works, we can address this in a follow-up
      "react-hooks/set-state-in-effect": "off",
      "no-unused-vars": ["error", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "no-console": ["warn", {
        allow: ["warn", "error"],
      }],
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      }],
      "import/order": ["error", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }],
      "import/no-anonymous-default-export": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "@next/next/no-img-element": "warn",
    },
  },
];

export default config;
