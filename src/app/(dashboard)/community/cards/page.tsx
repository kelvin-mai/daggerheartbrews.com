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
        subtitle='Check out homebrew cards created by the community'
      />
      <CommunityCards />
    </>
  );
}
