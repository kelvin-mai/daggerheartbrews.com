import { describe, it, expect } from 'vitest';
import { capitalize } from '@/lib/utils/string';

describe('capitalize', () => {
  it('should capitalize the first letter of a lowercase string', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should leave an already capitalized string unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('should handle a single character', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('should handle an empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should only capitalize the first character', () => {
    expect(capitalize('hello world')).toBe('Hello world');
  });
});
