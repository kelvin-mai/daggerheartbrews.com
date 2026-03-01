'use client';

import * as React from 'react';
import { CheckCircle } from 'lucide-react';

import { submitContact } from '@/actions/contact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Fields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type Errors = Partial<Fields>;

const validate = (fields: Fields): Errors => {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = 'Name is required.';
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!fields.subject.trim()) errors.subject = 'Subject is required.';
  if (!fields.message.trim()) errors.message = 'Message is required.';
  return errors;
};

export const ContactForm = () => {
  const [fields, setFields] = React.useState<Fields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const set =
    (key: keyof Fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [key]: e.target.value }));
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setPending(true);
    setActionError(null);
    const result = await submitContact(fields);
    setPending(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setActionError(
        result.errors?.action ?? 'Something went wrong. Please try again.',
      );
    }
  };

  if (submitted) {
    return (
      <div className='flex flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border py-14 text-center'>
        <div className='bg-muted flex size-14 items-center justify-center rounded-full'>
          <CheckCircle className='text-primary size-7' />
        </div>
        <div className='space-y-1'>
          <p className='text-lg font-semibold'>Message sent!</p>
          <p className='text-muted-foreground text-sm'>
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5' noValidate>
      <div className='grid gap-5 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            placeholder='Your name'
            value={fields.name}
            onChange={set('name')}
            aria-invalid={!!errors.name}
            disabled={pending}
          />
          {errors.name && (
            <p className='text-destructive text-sm'>{errors.name}</p>
          )}
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='you@example.com'
            value={fields.email}
            onChange={set('email')}
            aria-invalid={!!errors.email}
            disabled={pending}
          />
          {errors.email && (
            <p className='text-destructive text-sm'>{errors.email}</p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='subject'>Subject</Label>
        <Input
          id='subject'
          name='subject'
          placeholder='What is this about?'
          value={fields.subject}
          onChange={set('subject')}
          aria-invalid={!!errors.subject}
          disabled={pending}
        />
        {errors.subject && (
          <p className='text-destructive text-sm'>{errors.subject}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='message'>Message</Label>
        <Textarea
          id='message'
          name='message'
          placeholder='Tell me what is on your mind…'
          className='min-h-36'
          value={fields.message}
          onChange={set('message')}
          aria-invalid={!!errors.message}
          disabled={pending}
        />
        {errors.message && (
          <p className='text-destructive text-sm'>{errors.message}</p>
        )}
      </div>

      {actionError && <p className='text-destructive text-sm'>{actionError}</p>}

      <Button type='submit' className='w-full sm:w-auto' disabled={pending}>
        {pending ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
};
