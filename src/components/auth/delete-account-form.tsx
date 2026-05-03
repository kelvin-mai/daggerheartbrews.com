'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { deleteAccount } from '@/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DeleteAccountFormProps = {
  email: string;
};

export const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({
  email,
}) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [confirmation, setConfirmation] = React.useState('');
  const [pending, startTransition] = React.useTransition();

  const handleOpenChange = (next: boolean) => {
    if (!pending) {
      setOpen(next);
      if (!next) setConfirmation('');
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteAccount();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Your account has been deleted.');
        router.push('/login');
      }
    });
  };

  return (
    <div className='bg-card border-destructive/30 rounded-lg border p-4'>
      <h2 className='text-destructive text-lg font-bold'>Delete Account</h2>
      <p className='text-muted-foreground mb-4 text-sm'>
        Permanently delete your account and all of your content — cards,
        adversaries, bookmarks, and votes. This action cannot be undone.
      </p>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant='destructive'>Delete Account</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <p className='text-sm'>
            Type <span className='font-mono font-medium'>{email}</span> to
            confirm.
          </p>
          <Input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder={email}
            disabled={pending}
          />
          <DialogFooter showCloseButton>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={pending || confirmation !== email}
            >
              {pending && <Loader2 className='animate-spin' />}
              Permanently Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
