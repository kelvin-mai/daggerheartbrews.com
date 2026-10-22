import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@jpinsonneau/html-to-image', () => ({
  toPng: vi.fn().mockResolvedValue('data:image/png;base64,abc'),
}));

import { toPng } from '@jpinsonneau/html-to-image';
import { captureElementAsDataUrl } from '@/lib/utils/images';

const PIXEL = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

const makeDeferredLazyImage = (): HTMLImageElement => {
  const img = document.createElement('img');
  img.loading = 'lazy';
  img.src = PIXEL;
  Object.defineProperty(img, 'complete', {
    get: () => img.loading === 'eager',
  });
  return img;
};

describe('captureElementAsDataUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('switches lazy images to eager so off-screen captures do not hang', async () => {
    const element = document.createElement('div');
    const img = makeDeferredLazyImage();
    element.appendChild(img);

    await expect(captureElementAsDataUrl(element)).resolves.toBe(
      'data:image/png;base64,abc',
    );
    expect(img.loading).toBe('eager');
    expect(toPng).toHaveBeenCalledWith(element, {
      cacheBust: false,
      pixelRatio: 3,
    });
  });

  it('waits for incomplete eager images to finish loading', async () => {
    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = PIXEL;
    Object.defineProperty(img, 'complete', { get: () => false });
    element.appendChild(img);

    const promise = captureElementAsDataUrl(element);
    await Promise.resolve();
    expect(toPng).not.toHaveBeenCalled();

    img.dispatchEvent(new Event('load'));

    await expect(promise).resolves.toBe('data:image/png;base64,abc');
    expect(toPng).toHaveBeenCalledOnce();
  });
});
