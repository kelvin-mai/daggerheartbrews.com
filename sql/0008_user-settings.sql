CREATE TABLE "user_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "default_visibility" boolean NOT NULL DEFAULT false,
	"default_export_resolution" smallint DEFAULT 1 NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp
);