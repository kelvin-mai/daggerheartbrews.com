import * as React from 'react';
import {
  Body,
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

type ReplyEmailProps = {
  toName: string;
  toEmail: string;
  originalSubject: string;
  replyMessage: string;
};

export const ReplyEmail: React.FC<ReplyEmailProps> = ({
  toName,
  originalSubject,
  replyMessage,
}) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Re: {originalSubject} — reply from Daggerheart Brews</Preview>
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
            <Heading>Reply from Daggerheart Brews</Heading>
            <Text>Hello {toName},</Text>
            <Section className='rounded-lg bg-[#f5f3ff] p-4'>
              <Text className='m-0 text-sm font-semibold text-[#38227b]'>
                In reply to
              </Text>
              <Text className='mt-1'>{originalSubject}</Text>
            </Section>
            <Section className='mt-4 rounded-lg border border-[#e5e7eb] p-4'>
              <Text className='m-0 text-sm font-semibold text-[#38227b]'>
                Message
              </Text>
              <Text className='mt-1 whitespace-pre-wrap'>{replyMessage}</Text>
            </Section>
            <Hr className='mt-6 border-[#e5e7eb]' />
            <Text className='text-xs text-[#9ca3af]'>
              Sent from contact@daggerheartbrews.com. You can reply directly to
              this email.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
