'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type {
  CommentWithUser,
  UserAdversaryComment,
  UserCardComment,
} from '@/lib/types';
import {
  createCardComment,
  deleteCardComment,
  createAdversaryComment,
  deleteAdversaryComment,
} from '@/actions/comments';
import { Pagination } from '@/components/common';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 10;

type CommentSectionProps = {
  comments: CommentWithUser<UserCardComment | UserAdversaryComment>[];
  postType: 'card' | 'adversary';
  postId: string;
  currentUserId?: string;
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postType,
  postId,
  currentUserId,
}) => {
  const [body, setBody] = React.useState('');
  const [isSubmitPending, startSubmitTransition] = React.useTransition();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sort, setSort] = React.useState<'oldest' | 'newest'>('oldest');

  const sortedComments = sort === 'newest' ? [...comments].reverse() : comments;
  const totalPages = Math.max(1, Math.ceil(sortedComments.length / PAGE_SIZE));
  const clampedPage = Math.min(currentPage, totalPages);
  const paginatedComments = sortedComments.slice(
    (clampedPage - 1) * PAGE_SIZE,
    clampedPage * PAGE_SIZE,
  );

  const handleSortChange = (next: 'oldest' | 'newest') => {
    setSort(next);
    setCurrentPage(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    startSubmitTransition(async () => {
      const result =
        postType === 'card'
          ? await createCardComment({ userCardId: postId, body })
          : await createAdversaryComment({ userAdversaryId: postId, body });

      if (result.error) {
        toast.error(result.error);
      } else {
        setBody('');
        setCurrentPage(
          sort === 'newest' ? 1 : Math.ceil((comments.length + 1) / PAGE_SIZE),
        );
      }
    });
  };

  const handleDelete = (commentId: string) => {
    setDeletingId(commentId);
    startSubmitTransition(async () => {
      const result =
        postType === 'card'
          ? await deleteCardComment({ commentId })
          : await deleteAdversaryComment({ commentId });

      if (result.error) {
        toast.error(result.error);
      }
      setDeletingId(null);
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className='font-eveleth-clean text-sm'>
          Comments{comments.length > 0 ? ` (${comments.length})` : ''}
        </h2>
        {comments.length > 0 && (
          <div className='flex items-center gap-0.5'>
            <Button
              variant={sort === 'oldest' ? 'secondary' : 'ghost'}
              size='sm'
              className='h-7 px-2 text-xs'
              onClick={() => handleSortChange('oldest')}
            >
              Oldest
            </Button>
            <Button
              variant={sort === 'newest' ? 'secondary' : 'ghost'}
              size='sm'
              className='h-7 px-2 text-xs'
              onClick={() => handleSortChange('newest')}
            >
              Newest
            </Button>
          </div>
        )}
      </div>

      {comments.length > 0 && (
        <div className='space-y-4'>
          {paginatedComments.map(({ comment, user }) => {
            const isOwn =
              comment.userId !== null && comment.userId === currentUserId;
            const date = comment.createdAt
              ? new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '';

            return (
              <div key={comment.id} className='flex gap-3'>
                <div className='bg-muted flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-medium'>
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={32}
                      height={32}
                      className='size-8 object-cover'
                    />
                  ) : user ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <UserIcon className='text-muted-foreground size-4' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium'>
                      {user ? (
                        <Link
                          href={`/profile/${user.id}`}
                          className='hover:underline'
                        >
                          {user.name}
                        </Link>
                      ) : (
                        <span className='text-muted-foreground'>
                          Deleted User
                        </span>
                      )}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {date}
                    </span>
                  </div>
                  <p className='text-sm'>{comment.body}</p>
                </div>
                {isOwn && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='size-8 shrink-0 p-0'
                    disabled={deletingId === comment.id}
                    onClick={() => handleDelete(comment.id)}
                    aria-label='Delete comment'
                  >
                    <Trash2 className='size-4' />
                  </Button>
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <Pagination
              currentPage={clampedPage}
              pages={totalPages}
              onPage={setCurrentPage}
              buttonProps={{ variant: 'ghost' }}
            />
          )}
        </div>
      )}

      {currentUserId ? (
        <form onSubmit={handleSubmit} className='space-y-2'>
          <Textarea
            placeholder='Leave a comment...'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            disabled={isSubmitPending}
          />
          <div className='flex justify-end'>
            <Button
              type='submit'
              size='sm'
              disabled={isSubmitPending || !body.trim()}
            >
              Comment
            </Button>
          </div>
        </form>
      ) : (
        <p className='text-muted-foreground text-sm'>
          <Link href='/login' className='text-foreground hover:underline'>
            Sign in
          </Link>{' '}
          to leave a comment.
        </p>
      )}
    </div>
  );
};
