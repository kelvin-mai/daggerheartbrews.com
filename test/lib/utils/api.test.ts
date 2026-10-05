import { describe, it, expect, vi } from 'vitest';
import {
  MAX_IMAGE_UPLOAD_SIZE,
  MAX_REQUEST_BODY_SIZE,
  PAYLOAD_OVERHEAD,
  formatAPIError,
  assertPayloadSize,
  parseJSONResponse,
  PayloadTooLargeError,
  readJSONBody,
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

describe('MAX_IMAGE_UPLOAD_SIZE', () => {
  it('is derived from the request body limit and overhead', () => {
    expect(MAX_IMAGE_UPLOAD_SIZE).toBe(
      Math.floor(((MAX_REQUEST_BODY_SIZE - PAYLOAD_OVERHEAD) * 3) / 4),
    );
    expect(MAX_IMAGE_UPLOAD_SIZE).toBe(2949120);
  });

  it('is less than the request body limit scaled by 3/4', () => {
    expect(MAX_IMAGE_UPLOAD_SIZE).toBeLessThan((MAX_REQUEST_BODY_SIZE * 3) / 4);
    expect(MAX_IMAGE_UPLOAD_SIZE).toBeLessThan(MAX_REQUEST_BODY_SIZE);
  });

  it('allows a max-size image data URL in a typical card payload', () => {
    const image =
      'data:image/png;base64,' +
      'A'.repeat(4 * Math.ceil(MAX_IMAGE_UPLOAD_SIZE / 3));
    const payload = {
      card: { name: 'Fireball', text: 'a'.repeat(1000), image },
    };
    expect(() => assertPayloadSize(payload)).not.toThrow();
  });

  it('rejects a payload over the request body limit', () => {
    const payload = { image: 'a'.repeat(MAX_REQUEST_BODY_SIZE + 1) };
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

describe('readJSONBody', () => {
  const message = 'This is too large to save. Try uploading a smaller image.';

  const jsonOfSize = (bytes: number, filler = 'a') => {
    const base = JSON.stringify({ v: '' });
    const fillerBytes = new TextEncoder().encode(filler).byteLength;
    const count = Math.floor((bytes - base.length) / fillerBytes);
    const text = JSON.stringify({ v: filler.repeat(count) });
    return text + ' '.repeat(bytes - new TextEncoder().encode(text).byteLength);
  };

  const makeReq = (text: string, headers?: Record<string, string>) =>
    new Request('http://localhost/x', { method: 'POST', body: text, headers });

  it('parses a valid body', async () => {
    await expect(
      readJSONBody(makeReq(JSON.stringify({ card: { name: 'a' } }))),
    ).resolves.toEqual({ card: { name: 'a' } });
  });

  it('throws before reading the body when content-length is over the limit', async () => {
    const text = vi.fn();
    const req = {
      headers: new Headers({
        'content-length': String(MAX_REQUEST_BODY_SIZE + 1),
      }),
      text,
    } as unknown as Request;

    await expect(readJSONBody(req)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
    expect(text).not.toHaveBeenCalled();
  });

  it('uses the shared message and name', async () => {
    const req = makeReq(jsonOfSize(MAX_REQUEST_BODY_SIZE + 1));
    const error = await readJSONBody(req).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(PayloadTooLargeError);
    expect((error as Error).message).toBe(message);
    expect((error as Error).name).toBe('PayloadTooLargeError');
  });

  it('throws when content-length is missing and the body is over the limit', async () => {
    const req = makeReq(jsonOfSize(MAX_REQUEST_BODY_SIZE + 1));
    expect(req.headers.get('content-length')).toBeNull();
    await expect(readJSONBody(req)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it('throws when content-length is understated and the body is over the limit', async () => {
    const req = {
      headers: new Headers({ 'content-length': '10' }),
      text: () => Promise.resolve(jsonOfSize(MAX_REQUEST_BODY_SIZE + 1)),
    } as unknown as Request;
    await expect(readJSONBody(req)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it('accepts a body of exactly the limit', async () => {
    const text = jsonOfSize(MAX_REQUEST_BODY_SIZE);
    expect(new TextEncoder().encode(text).byteLength).toBe(
      MAX_REQUEST_BODY_SIZE,
    );
    await expect(readJSONBody(makeReq(text))).resolves.toMatchObject({});
  });

  it('rejects a body one byte over the limit', async () => {
    const text = jsonOfSize(MAX_REQUEST_BODY_SIZE + 1);
    await expect(readJSONBody(makeReq(text))).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it('counts multibyte characters as bytes', async () => {
    const text = JSON.stringify({
      v: '\u20ac'.repeat(Math.ceil(MAX_REQUEST_BODY_SIZE / 3)),
    });
    expect(text.length).toBeLessThan(MAX_REQUEST_BODY_SIZE);
    expect(new TextEncoder().encode(text).byteLength).toBeGreaterThan(
      MAX_REQUEST_BODY_SIZE,
    );
    await expect(readJSONBody(makeReq(text))).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });

  it('throws a SyntaxError for malformed JSON under the limit', async () => {
    await expect(readJSONBody(makeReq('{nope'))).rejects.toBeInstanceOf(
      SyntaxError,
    );
  });
});
