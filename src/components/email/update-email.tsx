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

type UpdateItem = {
  title: string;
  description: string;
};

type UpdateEmailProps = {
  whatsNew?: UpdateItem[];
};

const defaultWhatsNew: UpdateItem[] = [
  {
    title: 'Placeholder feature',
    description: 'A brief description of the new feature or improvement.',
  },
];

export const UpdateEmail: React.FC<UpdateEmailProps> = ({
  whatsNew = defaultWhatsNew,
}) => {
  const baseUrl = getBaseUrl();
  const communityUrl = `${baseUrl}/community`;
  const githubUrl = 'https://github.com/kelvinliu11/daggerheart-brews';

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          New updates to Daggerheart Brews — and we&apos;re looking for
          contributors
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

            <Heading>What&apos;s new</Heading>
            <Text>
              Here&apos;s a look at what&apos;s been added and improved in
              Daggerheart Brews.
            </Text>

            <Section>
              {whatsNew.map((item) => (
                <Text key={item.title} className='mt-2'>
                  <span className='font-semibold'>{item.title}</span>
                  {' — '}
                  {item.description}
                </Text>
              ))}
            </Section>

            <Section className='flex justify-center'>
              <Button
                className='rounded-lg bg-[#38227b] px-4 py-2 text-[#f3c267]'
                href={communityUrl}
              >
                Browse community content
              </Button>
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
