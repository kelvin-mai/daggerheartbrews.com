# Local Database Setup with Docker

This guide explains how to set up a local PostgreSQL database using Docker for development.

The project's `docker-compose.yml` file is pre-configured to automatically run all database migrations from the `sql/` directory when the container first starts, making setup quick and easy.

## Prerequisites

- [Docker](https://www.docker.com/get-started) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

## Quick Start

### 1. Start the PostgreSQL Container

The project includes a `docker-compose.yml` file configured for local development. Start the container:

```bash
docker-compose up -d
```

This will:

- Start a PostgreSQL 17 container named `dhbrews_db`
- Expose the database on port 5432
- Automatically run all SQL migrations from the `sql/` directory on first startup

### 2. Configure Environment Variables

Update your `.env` file with the local database connection string:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brews
```

The format is: `postgresql://[username]:[password]@[host]:[port]/[database]`

### 3. Verify Database Setup

Check that migrations ran successfully:

```bash
docker exec -it dhbrews_db psql -U postgres -d brews -c "\dt"
```

You should see all the tables created by the migrations in the `sql/` directory.

### 4. Start Development

```bash
npm run dev
```

Your app should now connect to the local PostgreSQL database running in Docker.

## Docker Commands

### Start the database

```bash
docker-compose up -d
```

### Stop the database

```bash
docker-compose down
```

### Stop and remove data (fresh start)

```bash
docker-compose down -v
```

### View logs

```bash
docker-compose logs -f postgres
```

### Connect to PostgreSQL CLI

```bash
docker exec -it dhbrews_db psql -U postgres -d brews
```

### Backup database

```bash
docker exec dhbrews_db pg_dump -U postgres brews > backup.sql
```

### Restore database

```bash
docker exec -i dhbrews_db psql -U postgres -d brews < backup.sql
```

## Database Management Tools

### Using psql (PostgreSQL CLI)

Connect to the database:

```bash
docker exec -it dhbrews_db psql -U postgres -d brews
```

Useful commands:

- `\dt` - List all tables
- `\d [table_name]` - Describe table structure
- `\q` - Quit

### Using GUI Tools

You can connect to the local database using GUI tools like:

- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

Connection details:

- **Host**: localhost
- **Port**: 5432
- **Database**: brews
- **Username**: postgres
- **Password**: postgres

## Troubleshooting

### Port Already in Use

If port 5432 is already in use, change the port mapping in `docker-compose.yml`:

```yaml
ports:
  - '5433:5432' # Use port 5433 on host
```

Then update your `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/brews
```

### Container Won't Start

Check if another PostgreSQL instance is running:

```bash
# Linux/macOS
sudo lsof -i :5432

# Windows
netstat -ano | findstr :5432
```

### Connection Refused

Make sure the container is running:

```bash
docker ps
```

Check container logs:

```bash
docker-compose logs postgres
```

### Reset Everything

To start fresh:

```bash
docker-compose down -v
docker-compose up -d
```

**Note**: Migrations will automatically run again when the container starts fresh.

### Apply New Migrations

When you add new migration files to the `sql/` directory, you have two options:

**Option 1: Restart the container (loses data)**

```bash
docker-compose down -v
docker-compose up -d
```

**Option 2: Apply manually (preserves data)**

```bash
docker exec -i dhbrews_db psql -U postgres -d brews < sql/XXXX_new_migration.sql
```

## Development vs Production

- **Development**: Uses `node-postgres` driver with local Docker PostgreSQL
- **Production**: Uses `neon-serverless` driver with Neon cloud database

The database client is automatically selected based on the environment (see `src/lib/database/index.ts`).

## Seed Data

The `sql/` directory contains both schema migrations and seed data files. Docker automatically runs all files in alphabetical order on first container startup.

### SQL Files

| File                          | Purpose                                                                |
| ----------------------------- | ---------------------------------------------------------------------- |
| `0000_options.sql`            | Schema: game options/reference tables                                  |
| `0001_auth.sql`               | Schema: Better Auth tables                                             |
| `0002_seed-options.sql`       | Seed: game options data                                                |
| `0003_previews.sql`           | Schema: card/adversary preview tables                                  |
| `0005_user_items.sql`         | Schema: user-created content tables                                    |
| `0006_seed-test-users.sql`    | Seed: test user accounts                                               |
| `0007_seed-content.sql`       | Seed: sample homebrew content                                          |
| `0008_user-settings.sql`      | Schema: user_settings table                                            |
| `template_neon-migration.sql` | Template: for drafting Neon migrations (always rolls back — see below) |

## Testing Migrations Before Production

`sql/template_neon-migration.sql` is a reusable template for drafting and validating migration SQL locally before running it in Neon's SQL editor.

### How it works

The template wraps all statements in `BEGIN; ... ROLLBACK;`. This means:

- **On local Docker**: the SQL executes fully (so errors surface), then rolls back — no data is changed
- **In Neon's SQL editor**: you paste only the statements between `BEGIN` and `ROLLBACK`, then end with `COMMIT` yourself

### Workflow

1. Copy the template and name it with a `scratch_` prefix so it sorts after numbered migrations:

   ```bash
   cp sql/template_neon-migration.sql sql/scratch_my-migration.sql
   ```

2. Write your migration in the numbered steps inside the file.

3. Test against local Postgres:

   ```bash
   docker exec -i dhbrews_db psql -U postgres -d brews < sql/scratch_my-migration.sql
   ```

   Review the output for errors. Repeat until it runs cleanly.

4. Copy the migration statements (without `BEGIN` / `ROLLBACK`) into Neon's SQL editor. Run each step in order, verifying row counts between steps.

5. Delete your scratch file once the migration is applied to production.

### Test Users

`0006_seed-test-users.sql` creates three test accounts for local development. All use the password `Password1`.

| Email            | Role         |
| ---------------- | ------------ |
| `admin@test.com` | Admin        |
| `user@test.com`  | Regular user |
| `user2@test.com` | Regular user |

### Applying Seed Files Manually

If you need to apply a seed file to a running container without resetting the database:

```bash
docker exec -i dhbrews_db psql -U postgres -d brews < sql/0006_seed-test-users.sql
```

To re-seed from scratch, restart the container with volumes removed:

```bash
docker-compose down -v
docker-compose up -d
```
