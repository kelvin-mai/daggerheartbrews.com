import { describe, it, expect } from 'vitest';

import { domainColor } from '@/lib/constants/reference/srd/domains';

describe('domainColor', () => {
  it('returns the colour for a known lowercase domain', () => {
    expect(domainColor('arcana')).toBe('#4e3456');
  });

  it('returns white when the domain is undefined', () => {
    expect(domainColor(undefined)).toBe('#fff');
  });

  it('returns white when the domain is an empty string', () => {
    expect(domainColor('')).toBe('#fff');
  });

  it('returns undefined for a wrong-case domain', () => {
    expect(domainColor('Arcana')).toBeUndefined();
  });

  it('returns undefined for an unmapped domain', () => {
    expect(domainColor('homebrew')).toBeUndefined();
  });
});
