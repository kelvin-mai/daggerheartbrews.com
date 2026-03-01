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
        title: 'Contact page',
        description:
          'Send messages directly via a contact form. Emails are delivered with a branded template.',
      },
      {
        title: 'About & Privacy Policy pages',
        description:
          'An overview of the project, its creator, the Community Gaming License, and full data transparency.',
      },
      {
        title: 'Outdated version banner',
        description:
          'Users on a stale cached version of the app are prompted to refresh.',
      },
      {
        title: 'Theme toggle on public pages',
        description:
          'Light, dark, and system mode is now available from the header on all public-facing pages.',
      },
    ],
  },
  {
    heading: 'Redesigned',
    items: [
      {
        title: 'Landing page',
        description:
          'Fully redesigned with a cleaner layout and clearer call-to-action sections.',
      },
      {
        title: 'Reference pages',
        description:
          'Ancestries, classes, beastforms, environments, and domains pages refreshed with consistent headers and improved filter controls.',
      },
      {
        title: 'Homebrew & community pages',
        description:
          'Personal post list, card layout, and empty states redesigned for better readability.',
      },
    ],
  },
  {
    heading: 'Improvements',
    items: [
      {
        title: 'Consistent page headers',
        description:
          'All dashboard pages use a unified header component with rewritten subtitle copy throughout.',
      },
      {
        title: 'Standardised filter controls',
        description:
          'Reference and community pages share a consistent multi-select filter pattern that stays stable as selections change.',
      },
      {
        title: 'Adversary creator layout',
        description:
          'Switched to CSS grid so the preview column no longer shifts when collapsible forms expand or collapse.',
      },
      {
        title: 'Dice roller shapes',
        description:
          'Damage tab buttons now use polygon shapes that match each die type.',
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
        title: 'Preview modal sizing',
        description: 'Preview modals were oversized on some screen sizes.',
      },
      {
        title: 'Beastform filter shifting',
        description:
          'The tier filter no longer causes the search bar to resize when multiple tiers are selected.',
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
          Daggerheart Brews {version} — new pages, redesigned UI, and bug fixes
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
