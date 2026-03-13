'use client';

import * as React from 'react';

import { sendBroadcast } from '@/actions/broadcast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const SendBroadcastSection = () => {
  const [template, setTemplate] = React.useState<'update' | 'changelog'>(
    'update',
  );
  const [subject, setSubject] = React.useState('');
  const [broadcastName, setBroadcastName] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sendResult, setSendResult] = React.useState<string | null>(null);
  const [sendError, setSendError] = React.useState<string | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !broadcastName.trim()) return;
    setSending(true);
    setSendResult(null);
    setSendError(null);
    const result = await sendBroadcast({
      template,
      subject: subject.trim(),
      name: broadcastName.trim(),
    });
    setSending(false);
    if (result.error) {
      setSendError(result.error);
    } else {
      setSendResult(`Broadcast sent (id: ${result.data?.id ?? 'unknown'})`);
      setSubject('');
      setBroadcastName('');
    }
  };

  return (
    <section className='bg-card rounded-lg border p-6'>
      <h2 className='mb-1 font-medium'>Send broadcast</h2>
      <p className='text-muted-foreground mb-4 text-sm'>
        Create and immediately send a broadcast to all subscribed contacts in
        your Resend audience.
      </p>
      <div className='max-w-sm space-y-4'>
        <div className='space-y-1.5'>
          <Label htmlFor='template'>Template</Label>
          <Select
            value={template}
            onValueChange={(v) => setTemplate(v as typeof template)}
          >
            <SelectTrigger id='template'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='update'>Update</SelectItem>
              <SelectItem value='changelog'>Changelog</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='name'>Broadcast name</Label>
          <Input
            id='name'
            placeholder='e.g. update-2026-03'
            value={broadcastName}
            onChange={(e) => setBroadcastName(e.target.value)}
          />
        </div>

        <div className='space-y-1.5'>
          <Label htmlFor='subject'>Subject line</Label>
          <Input
            id='subject'
            placeholder="e.g. What's new in Daggerheart Brews"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={sending || !subject.trim() || !broadcastName.trim()}
        >
          {sending ? 'Sending…' : 'Send broadcast'}
        </Button>

        {sendResult && (
          <p className='text-sm text-green-600 dark:text-green-400'>
            {sendResult}
          </p>
        )}
        {sendError && (
          <p className='text-sm text-red-600 dark:text-red-400'>{sendError}</p>
        )}
      </div>
    </section>
  );
};
