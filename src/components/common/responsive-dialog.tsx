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
        <DrawerContent>
          <DrawerTitle className='my-2 text-center'>{label}</DrawerTitle>
          <div className='overflow-y-auto px-4 pb-4'>{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>{label}</Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogTitle className='text-center'>{label}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};
