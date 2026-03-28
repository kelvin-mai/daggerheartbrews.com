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
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import { getBaseUrl } from '@/lib/utils';

export const UpdateEmail: React.FC = () => {
  const baseUrl = getBaseUrl();
  const changelogUrl = `${baseUrl}/changelog/v1.1.0`;
  const githubUrl = 'https://github.com/kelvin-mai/daggerheartbrews.com';

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Daggerheart Brews just shipped an update — v1.1.0</Preview>
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

            <Heading>First email update from Daggerheart Brews</Heading>
            <Text>
              Apologies for the lack of updates —{' '}
              <Link href='https://kelvinmai.io' className='text-[#38227b]'>
                Kelvin Mai
              </Link>
              , the main contributor of Daggerheart Brews, has been busy with
              life stuff. But the project is alive and kicking.
            </Text>
            <Text>
              Email updates have just been implemented on the site. If
              you&apos;d prefer not to receive these, you can opt out at any
              time in your{' '}
              <Link href={`${baseUrl}/profile`} className='text-[#38227b]'>
                profile settings
              </Link>
              .
            </Text>

            <Hr className='my-4 border-[#e5e7eb]' />

            <Heading>What&apos;s new in v1.1.0</Heading>
            <Text>Daggerheart Brews just shipped an update.</Text>

            <Section>
              <Text className='m-0 font-bold text-[#38227b]'>New</Text>
              {[
                {
                  title: 'Reference pages completed',
                  description:
                    'Reference data is now up to date with the latest SRD.',
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
              ].map((item) => (
                <Text key={item.title} className='mt-2'>
                  <span className='font-semibold'>{item.title}</span>
                  {' — '}
                  {item.description}
                </Text>
              ))}
            </Section>

            <Text className='text-muted-foreground text-sm'>
              Plus redesigns, bug fixes, performance improvements, and more.
            </Text>

            <Section className='flex justify-center'>
              <Button
                className='rounded-lg bg-[#38227b] px-4 py-2 text-[#f3c267]'
                href={changelogUrl}
              >
                View full changelog
              </Button>
            </Section>

            <Hr className='my-6 border-[#e5e7eb]' />

            <Section>
              <Text className='m-0 font-bold text-[#38227b]'>
                What&apos;s coming
              </Text>
              <Text>
                There&apos;s no official roadmap, but there are plans to keep
                expanding Daggerheart Brews with new features and improvements.
                If you have ideas or things you&apos;d like to see, feel free to{' '}
                <Link href={`${githubUrl}/issues`} className='text-[#38227b]'>
                  open an issue on GitHub
                </Link>
                .
              </Text>
            </Section>

            <Hr className='my-6 border-[#e5e7eb]' />

            <Section>
              <Text className='m-0 font-bold text-[#38227b]'>
                Open source — looking for contributors
              </Text>
              <Text>
                Daggerheart Brews is open source and we&apos;d love your help.
                Whether you want to fix a bug, add a feature, improve the
                design, or just poke around the code — all contributions are
                welcome.
              </Text>
              <Text>
                The project is built with Next.js, TypeScript, Tailwind CSS, and
                Drizzle ORM. If any of that sounds interesting, come take a
                look.
              </Text>
              <Text className='m-0 font-bold text-[#38227b]'>
                Vibe coders welcome
              </Text>
              <Text>
                The repo has been set up to work with Claude Code and OpenCode
                out of the box. If you prefer to build with AI assistance, the
                project is ready for it.
              </Text>
              <Button
                className='rounded-lg bg-[#1f2328] px-4 py-2 text-white'
                href={githubUrl}
              >
                View on GitHub
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
