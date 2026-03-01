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

type ContactEmailProps = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactEmail: React.FC<ContactEmailProps> = ({
  name,
  email,
  subject,
  message,
}) => {
  const replyUrl = `mailto:${email}`;

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>
          New contact message from {name}: {subject}
        </Preview>
        <Body className='font-sans'>
          <Container>
            <Section>
              <Img
                src={`${getBaseUrl()}/assets/images/dh-cgl-logo.png`}
                width={64}
                alt='Daggerheart Brews Logo'
                className='mx-auto'
              />
            </Section>
            <Heading>New contact message</Heading>
            <Text>
              You received a message via the Daggerheart Brews contact form.
            </Text>
            <Section className='rounded-lg bg-[#f5f3ff] p-4'>
              <Text className='m-0 text-sm font-semibold text-[#38227b]'>
                From
              </Text>
              <Text className='mt-1'>
                {name} &lt;{email}&gt;
              </Text>
              <Text className='m-0 text-sm font-semibold text-[#38227b]'>
                Subject
              </Text>
              <Text className='mt-1'>{subject}</Text>
            </Section>
            <Section className='mt-4 rounded-lg border border-[#e5e7eb] p-4'>
              <Text className='m-0 text-sm font-semibold text-[#38227b]'>
                Message
              </Text>
              <Text className='mt-1 whitespace-pre-wrap'>{message}</Text>
            </Section>
            <Section className='mt-6 flex justify-center'>
              <Button
                className='rounded-lg bg-[#38227b] px-4 py-2 text-[#f3c267]'
                href={replyUrl}
              >
                Reply to {name}
              </Button>
            </Section>
            <Hr className='mt-6 border-[#e5e7eb]' />
            <Text className='text-xs text-[#9ca3af]'>
              This message was sent via the contact form at
              daggerheartbrews.com.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
