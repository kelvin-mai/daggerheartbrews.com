export const formatAPIError = (
  error: unknown,
): { name: string; message: string } => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
    };
  }
  return {
    name: 'Unknown',
    message: 'Internal Server Error',
  };
};

// Vercel serverless functions reject request bodies over 4.5MB before they
// reach the route handler, so we check client-side and leave some headroom.
export const MAX_REQUEST_BODY_SIZE = 4 * 1024 * 1024;
export const PAYLOAD_OVERHEAD = 256 * 1024;
export const MAX_IMAGE_UPLOAD_SIZE = Math.floor(
  ((MAX_REQUEST_BODY_SIZE - PAYLOAD_OVERHEAD) * 3) / 4,
);

export const assertPayloadSize = (payload: unknown): void => {
  const size = new Blob([JSON.stringify(payload)]).size;
  if (size > MAX_REQUEST_BODY_SIZE) {
    throw new Error(
      'This is too large to save. Try uploading a smaller image.',
    );
  }
};

export const parseJSONResponse = async <T>(res: Response): Promise<T> => {
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error('Something went wrong. Please try again.');
  }
  return res.json();
};
