import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import { getBaseUrl } from '@/lib/utils';

type ChangelogEmailProps = {
  version: string;
};

type ChangelogSection = {
  heading: string;
  items: { title: string; description: string }[];
};

const sections: ChangelogSection[] = [
  {
    heading: 'New',
    items: [
      {
        title: 'Reference pages completed',
        description: 'Reference data is now up to date with the latest SRD.',
      },
      {
        title: 'The Void content',
        description:
          'The Void ancestries and abilities added to reference pages.',
      },
      {
        title: 'Blood domain',
        description:
          'New domain option and icon available in the card creator.',
      },
      {
        title: 'Privacy Policy',
        description:
          'Full disclosure of data collection, third-party services, and user rights.',
      },
      {
        title: 'Public by default',
        description:
          'Account setting to automatically make newly created homebrew content public.',
      },
      {
        title: 'Separate create and edit workflows',
        description:
          'Card and adversary creators now have distinct create and edit modes.',
      },
    ],
  },
  {
    heading: 'Redesigned',
    items: [
      {
        title: 'Reference pages',
        description:
          'Ancestries, classes, beastforms, environments, and domains pages refreshed with consistent headers and improved filter controls.',
      },
      {
        title: 'Class card previews',
        description:
          'New layout for class cards on the classes reference page.',
      },
      {
        title: 'Community posts',
        description:
          'Card layout and post list redesigned for better readability.',
      },
      {
        title: 'Homebrew page',
        description:
          'Personal post list redesigned to match the updated community layout.',
      },
      {
        title: 'Collapsible section trigger',
        description:
          'Refactored for consistency across the card and adversary creators.',
      },
    ],
  },
  {
    heading: 'Improvements',
    items: [
      {
        title: 'Higher resolution image exports',
        description:
          'Card and adversary exports now support 96, 192, and 288 DPI. A resolution selector appears next to the export button, and a preferred default can be saved in account settings.',
      },
      {
        title: 'Consistent filter controls',
        description:
          'Reference and community pages now have search and filtering enabled.',
      },
      {
        title: 'Responsive card templates',
        description: 'Card template sizes scale correctly across screen sizes.',
      },
      {
        title: 'Homebrew content limit raised',
        description: 'Users can now save more homebrew items per account.',
      },
      {
        title: 'User settings page',
        description: 'Profile settings page reorganised with clearer sections.',
      },
    ],
  },
  {
    heading: 'Bug Fixes',
    items: [
      {
        title: 'Input backgrounds in light mode',
        description:
          'Inputs, textareas, and selects now render white instead of inheriting the tinted page background.',
      },
      {
        title: 'Oversized preview modals',
        description: 'Fixed oversized preview modals on some screen sizes.',
      },
      {
        title: 'Beastform tier filter',
        description:
          'Beastform tier filter no longer causes the search bar to resize when multiple tiers are selected.',
      },
      {
        title: 'Adversary creation layout',
        description:
          'Adversary creation forms no longer shift layout when collapsible panels expand or collapse.',
      },
      {
        title: 'Save button size',
        description:
          'Save button no longer grows when the user is not logged in.',
      },
      {
        title: 'Image lost on edit',
        description:
          'Uploaded images are no longer dropped when returning to edit an existing card or adversary.',
      },
      {
        title: 'Use as template',
        description:
          'Using a community item as a template now correctly copies the source content.',
      },
      {
        title: 'Community browse link',
        description:
          'Community browse link on the home page now navigates correctly.',
      },
    ],
  },
];

export const ChangelogEmail: React.FC<ChangelogEmailProps> = ({ version }) => {
  const baseUrl = getBaseUrl();
  const changelogUrl = `${baseUrl}/changelog`;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          Daggerheart Brews {version} — new content, community features, and a
          site-wide refresh
        </Preview>
        <Body className='font-sans'>
          <Container>
            <Section>
              <Img
                src={`${baseUrl}/assets/images/dh-cgl-logo.png`}
                width={64}
                alt='Daggerheart Brews Logo'
                className='mx-auto'
              />
            </Section>

            <Heading>What&apos;s new in {version}</Heading>
            <Text>
              Daggerheart Brews just shipped a significant update. Here&apos;s a
              summary of everything that changed.
            </Text>

            {sections.map((section) => (
              <Section key={section.heading}>
                <Text className='m-0 font-bold text-[#38227b]'>
                  {section.heading}
                </Text>
                {section.items.map((item) => (
                  <Text key={item.title} className='mt-2'>
                    <span className='font-semibold'>{item.title}</span>
                    {' — '}
                    {item.description}
                  </Text>
                ))}
                <Hr className='my-4 border-[#e5e7eb]' />
              </Section>
            ))}

            <Section className='flex justify-center'>
              <Button
                className='rounded-lg bg-[#38227b] px-4 py-2 text-[#f3c267]'
                href={changelogUrl}
              >
                View full changelog
              </Button>
            </Section>

            <Hr className='mt-6 border-[#e5e7eb]' />
            <Text className='text-xs text-[#9ca3af]'>
              You&apos;re receiving this because you have an account on
              daggerheartbrews.com. Visit the site to explore the latest
              features.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
