import { render } from '@react-email/components';

import {
  VerificationEmail,
  ResetPasswordEmail,
  ChangelogEmail,
  ContactEmail,
  ReplyEmail,
  UpdateEmail,
  EmailPreviewClient,
} from '@/components/email';

export default async function EmailPreviewPage() {
  const templates = await Promise.all([
    render(
      <VerificationEmail
        user={{ name: 'Jane Doe', email: 'jane@example.com' }}
        url='http://localhost:3000/verify?token=preview'
      />,
    ).then((html) => ({ name: 'Verification', html })),
    render(
      <ResetPasswordEmail
        user={{ name: 'Jane Doe', email: 'jane@example.com' }}
        url='http://localhost:3000/reset-password?token=preview'
      />,
    ).then((html) => ({ name: 'Reset Password', html })),
    render(<ChangelogEmail version='v1.1.0' />).then((html) => ({
      name: 'Changelog',
      html,
    })),
    render(
      <ContactEmail
        name='Jane Doe'
        email='jane@example.com'
        subject='Test subject'
        message='This is a preview of the contact email template.'
      />,
    ).then((html) => ({ name: 'Contact', html })),
    render(
      <ReplyEmail
        toName='Jane Doe'
        toEmail='jane@example.com'
        originalSubject='Test subject'
        replyMessage='Thanks for reaching out! Here is my reply.'
      />,
    ).then((html) => ({ name: 'Reply', html })),
    render(<UpdateEmail />).then((html) => ({ name: 'Update (Draft)', html })),
  ]);

  return (
    <div className='py-6'>
      <h1 className='mb-4 text-xl font-semibold'>Email Previews</h1>
      <EmailPreviewClient templates={templates} />
    </div>
  );
}
