export const withSource = <T extends object>(
  items: T[],
  source: string,
): (T & { source: string })[] => items.map((item) => ({ ...item, source }));
