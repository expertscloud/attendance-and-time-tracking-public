#!/bin/sh
set -e

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 2
done
echo "MySQL is ready."

echo "Running migrations..."
node ace migration:run --force

echo "Running seeders..."
node ace db:seed

echo "Starting API server..."
exec "$@"
