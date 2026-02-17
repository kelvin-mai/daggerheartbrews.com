import { describe, it, expect } from 'vitest';
import { getBrightness } from '@/lib/utils/color';

describe('getBrightness', () => {
  it('should return 0 for black (#000000)', () => {
    expect(getBrightness('#000000')).toBe(0);
  });

  it('should return 255 for white (#ffffff)', () => {
    expect(getBrightness('#ffffff')).toBe(255);
  });

  it('should handle shorthand hex (#fff)', () => {
    expect(getBrightness('#fff')).toBe(255);
  });

  it('should handle shorthand hex (#000)', () => {
    expect(getBrightness('#000')).toBe(0);
  });

  it('should handle hex without # prefix', () => {
    expect(getBrightness('ffffff')).toBe(255);
  });

  it('should calculate correct brightness for red (#ff0000)', () => {
    // (255 * 299 + 0 * 587 + 0 * 114) / 1000 = 76.245
    expect(getBrightness('#ff0000')).toBeCloseTo(76.245);
  });

  it('should calculate correct brightness for green (#00ff00)', () => {
    // (0 * 299 + 255 * 587 + 0 * 114) / 1000 = 149.685
    expect(getBrightness('#00ff00')).toBeCloseTo(149.685);
  });

  it('should calculate correct brightness for blue (#0000ff)', () => {
    // (0 * 299 + 0 * 587 + 255 * 114) / 1000 = 29.07
    expect(getBrightness('#0000ff')).toBeCloseTo(29.07);
  });

  it('should default to black when called with no arguments', () => {
    expect(getBrightness()).toBe(0);
  });

  it('should handle shorthand hex for colors like #f80', () => {
    // ff=255, 88=136, 00=0
    // (255 * 299 + 136 * 587 + 0 * 114) / 1000 = 156.177
    expect(getBrightness('#f80')).toBeCloseTo(156.177, 0);
  });
});
