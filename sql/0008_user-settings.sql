CREATE TABLE "user_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "email_updates" boolean NOT NULL DEFAULT true,
  "default_visibility" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp
);