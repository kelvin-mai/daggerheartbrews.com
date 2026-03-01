-- =============================================================================
-- NEON PRODUCTION MIGRATION TEMPLATE
-- =============================================================================
-- PURPOSE: Test migration SQL against your local Docker database before
--          running it in Neon's SQL editor against production data.
--
-- WORKFLOW:
--   1. Copy this file and give it a descriptive name
--      (e.g. scratch_add-foo-column.sql — the "scratch_" prefix keeps it
--       sorted after numbered migrations)
--   2. Write your migration statements between BEGIN and ROLLBACK below
--   3. Test locally:
--        docker exec -i dhbrews_db psql -U postgres -d brews < sql/<your-file>.sql
--   4. Check the output carefully — the transaction always rolls back locally
--      so no data is changed, but errors will still surface
--   5. Once all statements run cleanly, copy them (without BEGIN / ROLLBACK)
--      into Neon's SQL editor and run against production
--
-- NOTE: This file is safe to leave in sql/ — the ROLLBACK at the bottom
--       ensures it has no effect when Docker runs it on container init.
-- =============================================================================


-- =============================================================================
-- PRE-FLIGHT CHECKLIST — complete before running anything in Neon
-- =============================================================================
--   [ ] Neon project has a restore point or recent backup available
--       (Neon console → Branches → Restore)
--   [ ] All SELECT verification queries below return the expected data
--   [ ] Every statement in this file runs locally without errors
--   [ ] If migrating large tables, schedule the run during low-traffic hours
--   [ ] Drizzle schema (src/lib/database/schema/) has been updated to match
--   [ ] Application code referencing changed columns has been updated
-- =============================================================================


BEGIN;

-- -----------------------------------------------------------------------------
-- STEP 1 — Verify current state (read-only; safe to run in Neon at any time)
-- -----------------------------------------------------------------------------
-- Confirm the table structure you're about to change looks as expected.

-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'target_table'
-- ORDER BY ordinal_position;

-- Count rows that will be affected by the migration.

-- SELECT COUNT(*) FROM target_table WHERE <condition>;


-- -----------------------------------------------------------------------------
-- STEP 2 — Schema changes
-- -----------------------------------------------------------------------------
-- Make structural changes first, before any data movement.

-- Add a column (nullable first if backfilling, then add NOT NULL after):
-- ALTER TABLE target_table ADD COLUMN new_column text;

-- Create a new table:
-- CREATE TABLE new_table (
--   id          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id     uuid      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   created_at  timestamp NOT NULL DEFAULT now(),
--   updated_at  timestamp
-- );


-- -----------------------------------------------------------------------------
-- STEP 3 — Data migration
-- Run this BEFORE dropping any old columns so you can verify the result.
-- -----------------------------------------------------------------------------

-- Backfill new table from existing data:
-- INSERT INTO new_table (user_id, some_column)
-- SELECT id, some_column FROM old_table;

-- Verify row counts match before continuing:
-- SELECT COUNT(*) FROM new_table; -- should equal the count from STEP 1


-- -----------------------------------------------------------------------------
-- STEP 4 — Constraints and indexes
-- Add NOT NULL constraints and indexes after data is in place.
-- -----------------------------------------------------------------------------

-- ALTER TABLE new_table ALTER COLUMN some_column SET NOT NULL;
-- CREATE INDEX idx_new_table_user_id ON new_table(user_id);


-- -----------------------------------------------------------------------------
-- STEP 5 — Cleanup
-- Only drop old columns / tables after STEP 3 is verified.
-- -----------------------------------------------------------------------------

-- ALTER TABLE old_table DROP COLUMN migrated_column;
-- DROP TABLE old_table;


-- =============================================================================
-- LOCAL SAFETY NET
-- This ROLLBACK ensures no data is modified when Docker runs this file on
-- container init, and when you test it manually against local Postgres.
--
-- When running in Neon's SQL editor:
--   - Remove the BEGIN line
--   - Replace ROLLBACK with COMMIT
--   - Run statements in order, verifying each step before proceeding
-- =============================================================================
ROLLBACK;
