import { toPng } from '@jpinsonneau/html-to-image';

export const fileToBase64 = (file: Blob | File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**
 * Downloads an HTML element as a PNG image
 * @param element - The HTML element to convert to an image
 * @param fileName - The name of the downloaded file (without extension)
 */
export const downloadElementAsImage = async (
  element: HTMLElement,
  fileName: string,
): Promise<void> => {
  const data = await toPng(element, { cacheBust: true });
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = data;
  link.click();
};
