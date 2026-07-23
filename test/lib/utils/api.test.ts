import { describe, it, expect } from 'vitest';
import {
  formatAPIError,
  assertPayloadSize,
  parseJSONResponse,
} from '@/lib/utils/api';

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

describe('assertPayloadSize', () => {
  it('does not throw for a small payload', () => {
    expect(() =>
      assertPayloadSize({ card: { name: 'Fireball' } }),
    ).not.toThrow();
  });

  it('throws when the payload exceeds the size limit', () => {
    const payload = { image: 'a'.repeat(5 * 1024 * 1024) };
    expect(() => assertPayloadSize(payload)).toThrow(
      'This is too large to save. Try uploading a smaller image.',
    );
  });
});

describe('parseJSONResponse', () => {
  it('parses a JSON response', async () => {
    const res = {
      headers: { get: () => 'application/json' },
      json: () => Promise.resolve({ success: true }),
    } as unknown as Response;

    await expect(parseJSONResponse(res)).resolves.toEqual({ success: true });
  });

  it('throws a friendly error when the response is not JSON', async () => {
    const res = {
      headers: { get: () => 'text/plain' },
      json: () => Promise.reject(new Error('should not be called')),
    } as unknown as Response;

    await expect(parseJSONResponse(res)).rejects.toThrow(
      'Something went wrong. Please try again.',
    );
  });

  it('throws a friendly error when content-type is missing', async () => {
    const res = {
      headers: { get: () => null },
      json: () => Promise.reject(new Error('should not be called')),
    } as unknown as Response;

    await expect(parseJSONResponse(res)).rejects.toThrow(
      'Something went wrong. Please try again.',
    );
  });
});
