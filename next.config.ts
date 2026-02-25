import { execSync } from 'child_process';
import type { NextConfig } from 'next';

import packageJson from './package.json';

const gitSha = execSync('git rev-parse --short HEAD').toString().trim();
const appVersion = `${packageJson.version}-${gitSha}`;

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
  },
  async redirects() {
    return [
      {
        source: '/create',
        destination: '/card/create',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
