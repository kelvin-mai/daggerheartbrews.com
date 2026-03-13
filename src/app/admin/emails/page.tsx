import { render } from '@react-email/components';

import {
  VerificationEmail,
  ResetPasswordEmail,
  ChangelogEmail,
  ContactEmail,
  UpdateEmail,
  EmailPreviewClient,
} from '@/components/email';

export default async function EmailPreviewPage() {
  const templates = await Promise.all([
    {
      name: 'Verification',
      html: await render(
        <VerificationEmail
          user={{ name: 'Jane Doe', email: 'jane@example.com' }}
          url='http://localhost:3000/verify?token=preview'
        />,
      ),
    },
    {
      name: 'Reset Password',
      html: await render(
        <ResetPasswordEmail
          user={{ name: 'Jane Doe', email: 'jane@example.com' }}
          url='http://localhost:3000/reset-password?token=preview'
        />,
      ),
    },
    {
      name: 'Changelog',
      html: await render(<ChangelogEmail version='v1.1.0' />),
    },
    {
      name: 'Contact',
      html: await render(
        <ContactEmail
          name='Jane Doe'
          email='jane@example.com'
          subject='Test subject'
          message='This is a preview of the contact email template.'
        />,
      ),
    },
    {
      name: 'Update (Draft)',
      html: await render(<UpdateEmail />),
    },
  ]);

  return (
    <div className='py-6'>
      <h1 className='mb-4 text-xl font-semibold'>Email Previews</h1>
      <EmailPreviewClient templates={templates} />
    </div>
  );
}
