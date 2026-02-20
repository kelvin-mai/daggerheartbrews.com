'use client';

import * as React from 'react';
import {
  ChevronUp,
  ChevronDown,
  Copy,
  ImageIcon,
  Layers,
  MessageCircle,
  Send,
  Skull,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import type { CardDetails } from '@/lib/types/card-creation';
import type { AdversaryDetails } from '@/lib/types/adversary-creation';

// ─── Types ────────────────────────────────────────────────────

type MockComment = {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
};

type VoteState = 'up' | 'down' | null;

// ─── Mock data ────────────────────────────────────────────────

const mockCards: {
  id: string;
  cardPreview: CardDetails;
  userName: string;
  votes: number;
  comments: MockComment[];
}[] = [
  {
    id: 'c1',
    cardPreview: {
      name: 'Blade of the Eclipse',
      type: 'equipment',
      tier: 2,
      text: 'A darkened blade that glows faintly under moonlight.',
    },
    userName: 'Rook Ashwood',
    votes: 14,
    comments: [
      {
        id: 'cm1',
        userName: 'Lyra Thornfield',
        text: 'Love this design! The tier feels right for the power level.',
        createdAt: '2 hours ago',
      },
      {
        id: 'cm2',
        userName: 'Grimm Stoneheart',
        text: 'Used this in my last session and it was a blast.',
        createdAt: '45 minutes ago',
      },
    ],
  },
  {
    id: 'c2',
    cardPreview: {
      name: 'Thornwood Heritage',
      type: 'ancestry',
      text: 'Born of the ancient Thornwood forests, your kind has deep roots.',
    },
    userName: 'Lyra Thornfield',
    votes: 8,
    comments: [
      {
        id: 'cm3',
        userName: 'Seraphina Dawn',
        text: 'Great flavor text. Would love to see a subclass to pair with this.',
        createdAt: '1 day ago',
      },
    ],
  },
  {
    id: 'c3',
    cardPreview: {
      name: 'Order of the Crimson Flame',
      type: 'community',
      text: 'A brotherhood of fire-sworn protectors.',
    },
    userName: 'Grimm Stoneheart',
    votes: 21,
    comments: [],
  },
  {
    id: 'c4',
    cardPreview: {
      name: 'Dawnbringer',
      type: 'subclass',
      domainPrimary: 'Grace',
      domainSecondary: 'Valor',
      text: 'Channels radiant energy through acts of courage.',
    },
    userName: 'Seraphina Dawn',
    votes: 3,
    comments: [
      {
        id: 'cm4',
        userName: 'Rook Ashwood',
        text: 'The Grace/Valor combo is really interesting. Feels balanced.',
        createdAt: '3 hours ago',
      },
      {
        id: 'cm5',
        userName: 'Grimm Stoneheart',
        text: 'How would this interact with multiclassing?',
        createdAt: '1 hour ago',
      },
      {
        id: 'cm6',
        userName: 'Seraphina Dawn',
        text: 'Good question! I think it would stack nicely with any Blade domain subclass.',
        createdAt: '30 minutes ago',
      },
    ],
  },
  {
    id: 'c5',
    cardPreview: {
      name: 'Shadowstep Mantle',
      type: 'equipment',
      tier: 3,
      hands: 0,
      text: 'A cloak that bends light around the wearer.',
    },
    userName: 'Rook Ashwood',
    votes: 0,
    comments: [],
  },
];

const mockAdversaries: {
  id: string;
  adversaryPreview: AdversaryDetails;
  userName: string;
  votes: number;
  comments: MockComment[];
}[] = [
  {
    id: 'a1',
    adversaryPreview: {
      name: 'Hollow Knight',
      type: 'solo',
      tier: 3,
      difficulty: 'severe',
      hp: 45,
      stress: 6,
      thresholds: [12, 24],
      attack: 'Spectral Blade',
      weapon: 'Greatsword',
      description: 'An empty suit of armor animated by pure malice.',
    },
    userName: 'Grimm Stoneheart',
    votes: 32,
    comments: [
      {
        id: 'cm7',
        userName: 'Rook Ashwood',
        text: 'This nearly TPK\'d my party. Perfect boss encounter.',
        createdAt: '5 hours ago',
      },
      {
        id: 'cm8',
        userName: 'Lyra Thornfield',
        text: 'The thresholds feel really well tuned. Great work!',
        createdAt: '2 hours ago',
      },
    ],
  },
  {
    id: 'a2',
    adversaryPreview: {
      name: 'Thornvine Crawler',
      type: 'horde',
      tier: 1,
      difficulty: 'standard',
      hp: 8,
      stress: 2,
      thresholds: [3, 6],
      attack: 'Lashing Thorns',
      description:
        'Tangled masses of animated bramble that roam forest floors.',
    },
    userName: 'Lyra Thornfield',
    votes: 5,
    comments: [],
  },
  {
    id: 'a3',
    adversaryPreview: {
      name: 'The Ashen Warden',
      type: 'leader',
      tier: 4,
      difficulty: 'extreme',
      hp: 60,
      stress: 8,
      thresholds: [18, 36],
      attack: 'Cinder Breath',
      description:
        'An ancient elemental bound to protect a forgotten shrine.',
    },
    userName: 'Seraphina Dawn',
    votes: 47,
    comments: [
      {
        id: 'cm9',
        userName: 'Grimm Stoneheart',
        text: 'Absolute menace. My players are still talking about this fight weeks later.',
        createdAt: '3 days ago',
      },
    ],
  },
  {
    id: 'a4',
    adversaryPreview: {
      name: 'Spore Goblin',
      type: 'minion',
      tier: 1,
      difficulty: 'standard',
      hp: 4,
      stress: 1,
      thresholds: [2, 3],
      attack: 'Toxic Spores',
      description:
        'Small, erratic creatures covered in luminescent fungus.',
    },
    userName: 'Rook Ashwood',
    votes: 11,
    comments: [
      {
        id: 'cm10',
        userName: 'Seraphina Dawn',
        text: 'Perfect for a creepy forest encounter. Love the flavor.',
        createdAt: '6 hours ago',
      },
    ],
  },
];

// ─── Voting component ─────────────────────────────────────────

function VoteButtons({
  initialVotes,
}: {
  initialVotes: number;
}) {
  const [vote, setVote] = React.useState<VoteState>(null);
  const [count, setCount] = React.useState(initialVotes);

  const handleVote = (direction: 'up' | 'down') => {
    if (vote === direction) {
      setVote(null);
      setCount(initialVotes);
    } else {
      setVote(direction);
      setCount(
        initialVotes + (direction === 'up' ? 1 : -1),
      );
    }
  };

  return (
    <div className='flex items-center gap-0.5'>
      <button
        type='button'
        onClick={() => handleVote('up')}
        className={`flex size-7 items-center justify-center rounded-md transition-colors hover:bg-accent ${
          vote === 'up'
            ? 'text-primary'
            : 'text-muted-foreground'
        }`}
        aria-label='Upvote'
      >
        <ChevronUp className='size-4' />
      </button>
      <span
        className={`min-w-[1.5rem] text-center text-xs font-semibold tabular-nums ${
          vote === 'up'
            ? 'text-primary'
            : vote === 'down'
              ? 'text-destructive'
              : 'text-muted-foreground'
        }`}
      >
        {count}
      </span>
      <button
        type='button'
        onClick={() => handleVote('down')}
        className={`flex size-7 items-center justify-center rounded-md transition-colors hover:bg-accent ${
          vote === 'down'
            ? 'text-destructive'
            : 'text-muted-foreground'
        }`}
        aria-label='Downvote'
      >
        <ChevronDown className='size-4' />
      </button>
    </div>
  );
}

// ─── Comments section ─────────────────────────────────────────

function CommentsSection({
  comments: initialComments,
}: {
  comments: MockComment[];
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [comments, setComments] = React.useState(initialComments);
  const [newComment, setNewComment] = React.useState('');

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    const comment: MockComment = {
      id: `new-${Date.now()}`,
      userName: 'You (Dev)',
      text: newComment.trim(),
      createdAt: 'Just now',
    };
    setComments((prev) => [...prev, comment]);
    setNewComment('');
    toast.success('[Dev] Comment added locally');
  };

  return (
    <div>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent hover:text-foreground'
      >
        <MessageCircle className='size-3.5' />
        <span>
          {comments.length}{' '}
          {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </button>

      {isOpen && (
        <div className='mt-2 space-y-3 border-t pt-3'>
          {comments.length > 0 ? (
            <div className='space-y-2.5'>
              {comments.map((comment) => (
                <div key={comment.id} className='flex gap-2.5'>
                  <Avatar className='mt-0.5 size-6 shrink-0'>
                    <AvatarFallback className='text-[9px]'>
                      {comment.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-xs font-medium'>
                        {comment.userName}
                      </span>
                      <span className='text-muted-foreground text-[10px]'>
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className='text-muted-foreground text-sm leading-relaxed'>
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-muted-foreground py-2 text-center text-xs'>
              No comments yet. Be the first to share your thoughts!
            </p>
          )}

          <div className='flex items-start gap-2'>
            <Avatar className='mt-1 size-6 shrink-0'>
              <AvatarFallback className='text-[9px]'>Y</AvatarFallback>
            </Avatar>
            <div className='flex min-w-0 flex-1 gap-2'>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder='Add a comment...'
                className='min-h-8 resize-none text-sm'
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                size='sm'
                variant='ghost'
                className='mt-0.5 size-8 shrink-0 p-0'
                onClick={handleSubmit}
                disabled={!newComment.trim()}
              >
                <Send className='size-3.5' />
                <span className='sr-only'>Send comment</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Post components with voting + comments ───────────────────

function MockCommunityCard({
  card,
}: {
  card: (typeof mockCards)[number];
}) {
  const { cardPreview, userName } = card;

  return (
    <div className='rounded-lg border bg-background transition-colors hover:bg-accent/30'>
      <div className='flex items-center gap-3 p-3'>
        <VoteButtons initialVotes={card.votes} />

        <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
          <ImageIcon className='text-muted-foreground size-5' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <p className='truncate font-medium'>
              {cardPreview.name || 'Untitled'}
            </p>
            <Badge
              variant='secondary'
              className='shrink-0 text-[10px] capitalize'
            >
              {cardPreview.type}
            </Badge>
          </div>
          <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
            <Avatar className='size-4'>
              <AvatarFallback className='text-[8px]'>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>{userName}</span>
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => toast.info('[Dev] Preview dialog would open')}
          >
            Preview
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => toast.info('[Dev] Would use as template')}
          >
            <Copy className='size-4' />
            <span className='sr-only sm:not-sr-only'>Use as template</span>
          </Button>
        </div>
      </div>

      <div className='px-3 pb-3'>
        <CommentsSection comments={card.comments} />
      </div>
    </div>
  );
}

function MockCommunityAdversary({
  adversary,
}: {
  adversary: (typeof mockAdversaries)[number];
}) {
  const { adversaryPreview, userName } = adversary;

  return (
    <div className='rounded-lg border bg-background transition-colors hover:bg-accent/30'>
      <div className='flex items-center gap-3 p-3'>
        <VoteButtons initialVotes={adversary.votes} />

        <div className='flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted'>
          <ImageIcon className='text-muted-foreground size-5' />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <p className='truncate font-medium'>
              {adversaryPreview.name || 'Untitled'}
            </p>
            {adversaryPreview.tier && (
              <Badge variant='secondary' className='shrink-0 text-[10px]'>
                Tier {adversaryPreview.tier}
              </Badge>
            )}
            {adversaryPreview.difficulty && (
              <Badge
                variant='outline'
                className='shrink-0 text-[10px] capitalize'
              >
                {adversaryPreview.difficulty}
              </Badge>
            )}
          </div>
          <div className='text-muted-foreground flex items-center gap-1.5 text-sm'>
            <Avatar className='size-4'>
              <AvatarFallback className='text-[8px]'>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className='truncate'>{userName}</span>
            {adversaryPreview.type && (
              <>
                <span aria-hidden='true'>{'|'}</span>
                <span className='capitalize'>{adversaryPreview.type}</span>
              </>
            )}
          </div>
        </div>

        <div className='flex shrink-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => toast.info('[Dev] Preview dialog would open')}
          >
            Preview
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => toast.info('[Dev] Would use as template')}
          >
            <Copy className='size-4' />
            <span className='sr-only sm:not-sr-only'>Use as template</span>
          </Button>
        </div>
      </div>

      <div className='px-3 pb-3'>
        <CommentsSection comments={adversary.comments} />
      </div>
    </div>
  );
}

// ─── Dev page ─────────────────────────────────────────────────

export default function DevCommunityPage() {
  return (
    <div className='bg-background text-foreground min-h-screen'>
      <div className='bg-destructive/10 border-b border-destructive/30 px-4 py-2 text-center text-sm font-medium text-destructive'>
        Dev Preview - Community Posts with Voting & Comments
      </div>

      <div className='mx-auto max-w-3xl px-4 py-8'>
        {/* Community Cards Section */}
        <section className='mb-10'>
          <div className='mb-4'>
            <h1 className='font-eveleth-clean text-2xl font-bold'>
              Community Cards
            </h1>
            <p className='text-muted-foreground'>
              Browse, vote, and discuss homebrew cards created by the community
            </p>
          </div>

          <div className='space-y-2'>
            {mockCards.map((card) => (
              <MockCommunityCard key={card.id} card={card} />
            ))}
          </div>
        </section>

        <hr className='border-border mb-10' />

        {/* Community Adversaries Section */}
        <section className='mb-10'>
          <div className='mb-4'>
            <h1 className='font-eveleth-clean text-2xl font-bold'>
              Community Adversaries
            </h1>
            <p className='text-muted-foreground'>
              Browse, vote, and discuss homebrew adversaries created by the
              community
            </p>
          </div>

          <div className='space-y-2'>
            {mockAdversaries.map((adv) => (
              <MockCommunityAdversary key={adv.id} adversary={adv} />
            ))}
          </div>
        </section>

        <hr className='border-border mb-10' />

        {/* Empty State */}
        <section>
          <h2 className='font-eveleth-clean mb-4 text-xl font-bold'>
            Empty State
          </h2>
          <div className='space-y-4'>
            <div className='bg-card flex flex-col items-center gap-3 rounded-lg border py-12 text-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
                <Layers className='text-muted-foreground size-6' />
              </div>
              <div>
                <p className='font-medium'>No public cards yet</p>
                <p className='text-muted-foreground text-sm'>
                  There are currently no public cards. Please check back later.
                </p>
              </div>
            </div>
            <div className='bg-card flex flex-col items-center gap-3 rounded-lg border py-12 text-center'>
              <div className='flex size-12 items-center justify-center rounded-full bg-muted'>
                <Skull className='text-muted-foreground size-6' />
              </div>
              <div>
                <p className='font-medium'>No public adversaries yet</p>
                <p className='text-muted-foreground text-sm'>
                  There are currently no public adversaries. Please check back
                  later.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
