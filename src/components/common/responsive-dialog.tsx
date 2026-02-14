import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

type ResponsiveDialogProps = React.ComponentProps<typeof Button> & {
  label: string;
};

export const ResponsiveDialog: React.FC<ResponsiveDialogProps> = ({
  label,
  children,
  ...props
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button {...props}>{label}</Button>
        </DrawerTrigger>
        <DrawerContent className='max-h-[95vh] overflow-auto'>
          <DrawerTitle className='my-2 text-center'>{label}</DrawerTitle>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>{label}</Button>
      </DialogTrigger>
      <DialogContent className='w-auto max-w-[1100px]'>
        <DialogTitle className='text-center'>{label}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};
