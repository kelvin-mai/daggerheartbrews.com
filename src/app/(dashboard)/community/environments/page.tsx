import { PageHeader } from '@/components/common';
import { CommunityEnvironments } from './client';

export const metadata = {
  title: 'Community Environments',
  description: 'Check out homebrew environments created by the community',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Community Environments'
        subtitle='Discover environments crafted by the Daggerheart community.'
        className='mb-4'
      />
      <CommunityEnvironments />
    </>
  );
}
