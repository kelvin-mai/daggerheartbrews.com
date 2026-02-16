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
  - "5433:5432"  # Use port 5433 on host
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

## Syncing Production Data

You can sync data from the production Neon database to your local Docker database for testing with real data.

### Prerequisites

Set the production database URL as an environment variable:

```bash
# Add to .env (but don't commit!)
PRODUCTION_DATABASE_URL=postgresql://user:pass@host/db
```

Or pass it directly when running the command.

### Sync Directly to Local Database

This will overwrite your local database with production data and reset all passwords to "Password1":

```bash
npm run db:sync
```

Or with inline environment variable:

```bash
PRODUCTION_DATABASE_URL=your_neon_url npm run db:sync
```

### Save as Migration File

To save the production data as a migration file (useful for sharing test data with the team):

```bash
npm run db:sync -- --to-migrations
```

This will:
1. Dump the production database
2. Reset all user passwords to "Password1"
3. Save as a new numbered migration file in `sql/`
4. NOT modify your local database

You can then apply the migration whenever needed:

```bash
docker-compose down -v
docker-compose up -d
```

### Testing with Production Data

After syncing, all user accounts will have the password `Password1` for easy local testing:

- Login with any production user email
- Use password: `Password1`

⚠️ **Security Note**: Never commit production data or `PRODUCTION_DATABASE_URL` to version control!

## Next Steps

- Set up database seeding for test data
- Create specific test fixtures for different scenarios
