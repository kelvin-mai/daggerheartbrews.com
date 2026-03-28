'use client';

import * as React from 'react';

import {
  getReceivedEmail,
  listReceivedEmails,
  replyToEmail,
} from '@/actions/inbox';
import type { ReceivedEmail, ReceivedEmailDetail } from '@/actions/inbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  initialEmails: ReceivedEmail[];
};

const formatDate = (iso: string) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const parseFrom = (from: string) => {
  const match = from.match(/^(.*?)\s*<(.+)>$/);
  if (match) return { name: match[1].trim(), email: match[2].trim() };
  return { name: from, email: from };
};

export const InboxSection = ({ initialEmails }: Props) => {
  const [emails, setEmails] = React.useState<ReceivedEmail[]>(initialEmails);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<ReceivedEmailDetail | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailError, setDetailError] = React.useState<string | null>(null);
  const [replyMessage, setReplyMessage] = React.useState('');
  const [replying, setReplying] = React.useState(false);
  const [replyResult, setReplyResult] = React.useState<string | null>(null);
  const [replyError, setReplyError] = React.useState<string | null>(null);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [cursor, setCursor] = React.useState<{
    after?: string;
    before?: string;
  }>({});

  const selectEmail = async (email: ReceivedEmail) => {
    if (selectedId === email.id) return;
    setSelectedId(email.id);
    setDetail(null);
    setDetailError(null);
    setReplyMessage('');
    setReplyResult(null);
    setReplyError(null);
    setDetailLoading(true);
    const result = await getReceivedEmail(email.id);
    setDetailLoading(false);
    if (result.error) {
      setDetailError(result.error);
    } else {
      setDetail(result.data);
    }
  };

  const loadPage = async (params: { after?: string; before?: string }) => {
    setLoadingMore(true);
    const result = await listReceivedEmails({ ...params });
    setLoadingMore(false);
    if (result.data) {
      setEmails(result.data);
      setCursor(params);
      setSelectedId(null);
      setDetail(null);
    }
  };

  const handleReply = async () => {
    if (!detail || !replyMessage.trim()) return;
    const replyToAddress = detail.replyTo[0] ?? detail.from;
    const { name, email } = parseFrom(replyToAddress);
    setReplying(true);
    setReplyResult(null);
    setReplyError(null);
    const result = await replyToEmail({
      toName: name,
      toEmail: email,
      originalSubject: detail.subject.replace(/^\[Contact\]\s*/, ''),
      replyMessage: replyMessage.trim(),
    });
    setReplying(false);
    if (result.error) {
      setReplyError(result.error);
    } else {
      setReplyResult('Reply sent.');
      setReplyMessage('');
    }
  };

  const selectedEmail = emails.find((e) => e.id === selectedId);

  return (
    <div className='grid grid-cols-[280px_1fr] divide-x overflow-hidden rounded-lg border'>
      <div className='flex flex-col'>
        <div className='border-b px-4 py-3'>
          <p className='text-sm font-medium'>Contact submissions</p>
        </div>
        {emails.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center'>
            <p className='text-muted-foreground text-sm'>No messages yet.</p>
            <p className='text-muted-foreground text-xs'>
              Enable Resend inbound receiving to capture contact form
              submissions. See{' '}
              <code className='text-xs'>docs/resend-inbound-setup.md</code>.
            </p>
          </div>
        ) : (
          <>
            <ul className='flex-1 divide-y overflow-y-auto'>
              {emails.map((email) => (
                <li key={email.id}>
                  <button
                    onClick={() => selectEmail(email)}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      selectedId === email.id ? 'bg-muted' : 'hover:bg-muted/50'
                    }`}
                  >
                    <p className='truncate text-sm font-medium'>
                      {parseFrom(email.from).name || email.from}
                    </p>
                    <p className='text-muted-foreground truncate text-xs'>
                      {email.subject.replace(/^\[Contact\]\s*/, '')}
                    </p>
                    <p className='text-muted-foreground mt-0.5 text-xs'>
                      {formatDate(email.receivedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
            <div className='flex items-center justify-between border-t px-4 py-2'>
              <Button
                variant='ghost'
                size='sm'
                disabled={!cursor.after || loadingMore}
                onClick={() => loadPage({ before: emails[0]?.id })}
              >
                Newer
              </Button>
              <Button
                variant='ghost'
                size='sm'
                disabled={loadingMore}
                onClick={() =>
                  loadPage({ after: emails[emails.length - 1]?.id })
                }
              >
                Older
              </Button>
            </div>
          </>
        )}
      </div>

      <div className='flex flex-col'>
        {!selectedId ? (
          <div className='flex flex-1 items-center justify-center p-6'>
            <p className='text-muted-foreground text-sm'>
              Select a message to view it.
            </p>
          </div>
        ) : detailLoading ? (
          <div className='flex flex-1 items-center justify-center p-6'>
            <p className='text-muted-foreground text-sm'>Loading…</p>
          </div>
        ) : detailError ? (
          <div className='flex flex-1 items-center justify-center p-6'>
            <p className='text-sm text-red-600 dark:text-red-400'>
              {detailError}
            </p>
          </div>
        ) : detail ? (
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='border-b px-6 py-4'>
              <h3 className='font-medium'>
                {detail.subject.replace(/^\[Contact\]\s*/, '')}
              </h3>
              <p className='text-muted-foreground mt-0.5 text-sm'>
                From: {detail.from}
              </p>
              <p className='text-muted-foreground text-xs'>
                {formatDate(detail.receivedAt)}
              </p>
            </div>

            <div className='flex-1 overflow-y-auto'>
              {detail.html ? (
                <iframe
                  srcDoc={detail.html}
                  className='h-full min-h-[300px] w-full'
                  sandbox='allow-same-origin'
                  title='Email content'
                />
              ) : (
                <pre className='p-6 text-sm whitespace-pre-wrap'>
                  {detail.text ?? 'No content.'}
                </pre>
              )}
            </div>

            <div className='border-t px-6 py-4'>
              <p className='mb-2 text-sm font-medium'>Reply</p>
              <Textarea
                placeholder='Write your reply…'
                rows={4}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className='mb-3'
              />
              <Button
                onClick={handleReply}
                disabled={replying || !replyMessage.trim()}
              >
                {replying ? 'Sending…' : 'Send reply'}
              </Button>
              {replyResult && (
                <p className='mt-2 text-sm text-green-600 dark:text-green-400'>
                  {replyResult}
                </p>
              )}
              {replyError && (
                <p className='mt-2 text-sm text-red-600 dark:text-red-400'>
                  {replyError}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
