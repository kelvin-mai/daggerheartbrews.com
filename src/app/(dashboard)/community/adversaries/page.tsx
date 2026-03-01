import { PageHeader } from '@/components/common';
import { CommunityAdversaries } from './client';

export const metadata = {
  title: 'Community Adversaries',
  description: 'Check out homebrew adversaries created by the community',
};

export default function Page() {
  return (
    <>
      <PageHeader
        title='Community Adversaries'
        subtitle='Check out homebrew adversaries created by the community'
      />
      <CommunityAdversaries />
    </>
  );
}
