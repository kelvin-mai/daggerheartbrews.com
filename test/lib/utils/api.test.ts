import { describe, it, expect } from 'vitest';
import { formatAPIError } from '@/lib/utils/api';

describe('formatAPIError', () => {
  it('should format an Error instance', () => {
    const error = new Error('Something went wrong');
    expect(formatAPIError(error)).toEqual({
      name: 'Error',
      message: 'Something went wrong',
    });
  });

  it('should format a TypeError', () => {
    const error = new TypeError('Invalid type');
    expect(formatAPIError(error)).toEqual({
      name: 'TypeError',
      message: 'Invalid type',
    });
  });

  it('should return generic error for a string', () => {
    expect(formatAPIError('some error')).toEqual({
      name: 'Unknown',
      message: 'Internal Server Error',
    });
  });

  it('should return generic error for null', () => {
    expect(formatAPIError(null)).toEqual({
      name: 'Unknown',
      message: 'Internal Server Error',
    });
  });

  it('should return generic error for undefined', () => {
    expect(formatAPIError(undefined)).toEqual({
      name: 'Unknown',
      message: 'Internal Server Error',
    });
  });

  it('should return generic error for a plain object', () => {
    expect(formatAPIError({ message: 'oops' })).toEqual({
      name: 'Unknown',
      message: 'Internal Server Error',
    });
  });
});
