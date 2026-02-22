import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
}, {
  // Allow <img> in preview components (needed for canvas rendering)
  files: [
    'src/components/card-creation/preview/**/*.{ts,tsx}',
    'src/components/adversary-creation/preview/**/*.{ts,tsx}',
    'src/components/card-creation/forms/domain-select.tsx',
    'src/components/card-creation/forms/image.tsx',
  ],
  rules: {
    '@next/next/no-img-element': 'off',
  },
}, {
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
