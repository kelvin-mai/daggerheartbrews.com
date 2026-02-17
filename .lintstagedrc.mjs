import path from 'path';

const buildEslintCommand = (filenames) => {
  const files = filenames.map((f) => path.relative(process.cwd(), f));
  return `next lint --fix --file ${files.join(' --file ')}`;
};

export default {
  '*.{ts,tsx,js,jsx}': ['prettier --write --cache', buildEslintCommand],
  '*.{json,md,mdx}': ['prettier --write --cache'],
};
