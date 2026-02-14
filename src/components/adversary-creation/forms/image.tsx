'use client';

import * as React from 'react';

import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import { UploadIcon, X } from 'lucide-react';
import { useAdversaryActions, useAdversaryStore } from '@/store';
import {
  type Area,
  ImageCropper,
  ImageCropperArea,
  ImageCropperImage,
} from '@/components/common';
import { FormContainer } from '@/components/common/form';
import { CollapsibleContent } from '@radix-ui/react-collapsible';
import { fileToBase64 } from '@/lib/utils';

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImage = async (
  url: string,
  area: Area,
): Promise<Blob | null> => {
  try {
    const image = await createImage(url);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    canvas.width = area.width;
    canvas.height = area.height;
    ctx.drawImage(
      image,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      area.width,
      area.height,
    );
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject();
        }
      }, 'image/png');
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const AdversaryImageForm = () => {
  const {
    adversary: { image },
  } = useAdversaryStore();
  const { setAdversaryDetails } = useAdversaryActions();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({ accept: 'image/*' });
  const [file] = files;
  const [existingImagePreview, setExistingImagePreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file?.preview) {
      setAdversaryDetails({ image: file.preview });
    }
  }, [file, setAdversaryDetails]);

  // Load existing image when editing an adversary
  React.useEffect(() => {
    if (image && !file) {
      setExistingImagePreview(image);
    } else if (!image || file) {
      setExistingImagePreview(null);
    }
  }, [image, file]);

  const handleCropChange = async (area: Area | null) => {
    if (area && file?.preview) {
      const blob = await getCroppedImage(file.preview, area);
      if (blob) {
        const cropped = await fileToBase64(blob);
        if (image !== cropped) {
          setAdversaryDetails({ image: cropped });
        }
      }
    }
  };

  return (
    <FormContainer title='Adversary Image' collapsible defaultOpen>
      <div className='space-y-2'>
        <div className='flex flex-col gap-2'>
          <Button
            variant='outline'
            className='h-10 bg-white'
            onClick={openFileDialog}
          >
            <UploadIcon className='size-3' />
            Add Image
          </Button>
          <input
            {...getInputProps()}
            className='sr-only'
            aria-label='Upload image file'
            tabIndex={-1}
          />
          {file ? (
            <div className='dark:bg-input/30 flex items-center justify-between gap-2 rounded-md border bg-white p-2'>
              <div className='flex items-center gap-4 overflow-hidden'>
                <div className='bg-accent aspect-square shrink-0 rounded'>
                  <img
                    className='size-10 rounded-[inherit] object-cover'
                    src={file.preview}
                    alt={file.file.name}
                  />
                </div>
                <div>
                  <p className='truncate text-sm font-medium'>
                    {file.file.name}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {formatBytes(file.file.size)}
                  </p>
                </div>
              </div>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => removeFile(file.id)}
                aria-label='Remove file'
              >
                <X aria-hidden='true' />
              </Button>
            </div>
          ) : existingImagePreview ? (
            <div className='dark:bg-input/30 flex items-center justify-between gap-2 rounded-md border bg-white p-2'>
              <div className='flex items-center gap-4 overflow-hidden'>
                <div className='bg-accent aspect-square shrink-0 rounded'>
                  <img
                    className='size-10 rounded-[inherit] object-cover'
                    src={existingImagePreview}
                    alt='Existing image'
                  />
                </div>
                <div>
                  <p className='truncate text-sm font-medium'>Existing image</p>
                  <p className='text-muted-foreground text-sm'>
                    Previously uploaded
                  </p>
                </div>
              </div>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => {
                  setAdversaryDetails({ image: undefined });
                  setExistingImagePreview(null);
                }}
                aria-label='Remove existing image'
              >
                <X aria-hidden='true' />
              </Button>
            </div>
          ) : null}
        </div>
        <CollapsibleContent>
          {(file?.preview || existingImagePreview) ? (
            <ImageCropper
              className='h-64 rounded'
              image={file?.preview || existingImagePreview!}
              minZoom={0.2}
              onCropChange={handleCropChange}
            >
              <ImageCropperImage />
              <ImageCropperArea />
            </ImageCropper>
          ) : null}
        </CollapsibleContent>
      </div>
    </FormContainer>
  );
};
