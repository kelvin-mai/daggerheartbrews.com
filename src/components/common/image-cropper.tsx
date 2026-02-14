'use client';

import * as React from 'react';
import { Cropper } from '@origin-space/image-cropper';

import { cn } from '@/lib/utils';

export type Area = { x: number; y: number; width: number; height: number };

export const ImageCropper: React.FC<
  React.ComponentProps<typeof Cropper.Root>
> = ({ className, children, ...props }) => {
  return (
    <Cropper.Root
      data-slot='cropper'
      className={cn(
        'relative flex w-full cursor-move touch-none items-center justify-center overflow-hidden focus:outline-none',
        className,
      )}
      {...props}
    >
      <Cropper.Description
        data-slot='cropper-description'
        className='sr-only'
      />
      {children}
    </Cropper.Root>
  );
};

export const ImageCropperImage: React.FC<
  React.ComponentProps<typeof Cropper.Image>
> = ({ className, ...props }) => {
  return (
    <Cropper.Image
      data-slot='cropper-image'
      className={cn(
        'pointer-events-none h-full w-full object-contain',
        className,
      )}
      {...props}
    />
  );
};

export const ImageCropperArea: React.FC<
  React.ComponentProps<typeof Cropper.CropArea>
> = ({ className, ...props }) => {
  return (
    <Cropper.CropArea
      data-slot='cropper-crop-area'
      className={cn(
        'pointer-events-none absolute border-3 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] in-[[data-slot=cropper]:focus-visible]:ring-[3px] in-[[data-slot=cropper]:focus-visible]:ring-white/5',
        className,
      )}
      {...props}
    />
  );
};
