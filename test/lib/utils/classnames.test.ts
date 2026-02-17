import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils/classnames';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('should merge conflicting tailwind classes', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('should merge conflicting tailwind color classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should handle empty input', () => {
    expect(cn()).toBe('');
  });

  it('should handle array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });
});
