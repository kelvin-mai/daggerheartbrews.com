import { toPng } from '@jpinsonneau/html-to-image';

export const fileToBase64 = (file: Blob | File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const waitForImages = (element: HTMLElement): Promise<void> =>
  Promise.all(
    Array.from(element.querySelectorAll('img')).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const inlineImages = async (element: HTMLElement): Promise<() => void> => {
  const restores: Array<() => void> = [];

  await Promise.all(
    Array.from(element.querySelectorAll<HTMLImageElement>('img')).map(
      async (img) => {
        const src = img.currentSrc || img.src;
        if (!src || src.startsWith('data:')) return;
        try {
          const blob = await fetch(src).then((r) => r.blob());
          const dataUrl = await blobToDataUrl(blob);
          const origSrc = img.src;
          const origSrcset = img.srcset;
          img.srcset = '';
          img.src = dataUrl;
          restores.push(() => {
            img.srcset = origSrcset;
            img.src = origSrc;
          });
        } catch {
          // leave as-is; toPng will skip or use placeholder
        }
      },
    ),
  );

  return () => restores.forEach((r) => r());
};

export const captureElementAsDataUrl = async (
  element: HTMLElement,
  pixelRatio = 3,
): Promise<string> => {
  await waitForImages(element);

  const restoreImages = await inlineImages(element);

  try {
    return await toPng(element, { cacheBust: false, pixelRatio });
  } finally {
    restoreImages();
  }
};

export const downloadElementAsImage = async (
  element: HTMLElement,
  fileName: string,
  options?: { pixelRatio?: number },
): Promise<void> => {
  const data = await toPng(element, {
    cacheBust: true,
    pixelRatio: options?.pixelRatio ?? 1,
  });
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = data;
  link.click();
};
