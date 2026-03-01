import { PageHeader } from '@/components/common';
import { CommunityCards } from './client';

export const metadata = {
  title: 'Community Cards',
  description: 'Check out homebrew cards created by the community',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Community Cards'
        subtitle='Discover cards crafted by the Daggerheart community.'
        className='mb-4'
      />
      <CommunityCards />
    </>
  );
}
