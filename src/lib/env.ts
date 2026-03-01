import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().min(1000).optional(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  RESEND_AUDIENCE_ID: z.string().optional(),
  BROADCAST_SECRET: z.string().optional(),
});

export const env = schema.parse(process.env);
