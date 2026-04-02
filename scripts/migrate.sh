#!/usr/bin/env bash
# Apply SQL files from sql/ to the running Docker Postgres container.
#
# Usage:
#   ./scripts/migrate.sh            # apply all files in order
#   ./scripts/migrate.sh 0009 0010  # apply specific files by prefix

set -euo pipefail

CONTAINER="dhbrews_db"
DB="brews"
USER="postgres"
SQL_DIR="$(cd "$(dirname "$0")/../sql" && pwd)"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
  echo "Error: container '${CONTAINER}' is not running." >&2
  exit 1
fi

run_file() {
  local file="$1"
  echo "  applying $(basename "$file")..."
  docker exec -i "$CONTAINER" psql -U "$USER" -d "$DB" < "$file"
}

if [[ $# -gt 0 ]]; then
  # Apply only files whose names start with the given prefixes
  for prefix in "$@"; do
    matched=false
    for file in "$SQL_DIR"/${prefix}*.sql; do
      [[ -f "$file" ]] || continue
      run_file "$file"
      matched=true
    done
    if [[ "$matched" == false ]]; then
      echo "Warning: no file found matching prefix '${prefix}' in sql/" >&2
    fi
  done
else
  # Apply all .sql files in filename order, skipping templates
  for file in $(ls "$SQL_DIR"/*.sql | sort); do
    [[ "$(basename "$file")" == template_* ]] && continue
    run_file "$file"
  done
fi

echo "Done."
