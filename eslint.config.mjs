import nextConfig from "eslint-config-next/core-web-vitals";

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    rules: {
      // console.logの警告（warn, errorは許可）
      "no-console": ["warn", { allow: ["warn", "error"] }],
      
      // 基本的なコード品質
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always"],
      
      // 配列・オブジェクトの末尾カンマ
      "comma-dangle": ["error", {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      }],
      
      // React関連
      "react/prop-types": "off",
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": "error",
      
      // Disable overly strict rule - setting state in useEffect for initialization is a valid pattern
      "react-hooks/set-state-in-effect": "off",
      
      // アクセシビリティ
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      
      // Next.js specific
      "@next/next/no-img-element": "warn",
    },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "data/shishaData.js"],
  },
];

export default config;
