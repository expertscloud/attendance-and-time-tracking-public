#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"
ENV_FILE="$ROOT/.env"

generate_key() {
  if [ -d "$BACKEND/node_modules/@adonisjs/core" ]; then
    (cd "$BACKEND" && node ace generate:key)
    return
  fi

  echo "Installing backend dependencies to run ace..."
  docker run --rm \
    -v "$BACKEND:/app" \
    -w /app \
    node:20-alpine \
    sh -c "npm ci && node ace generate:key"
}

echo "Generating AdonisJS APP_KEY..."
OUTPUT="$(generate_key)"
echo "$OUTPUT"

KEY_LINE="$(echo "$OUTPUT" | grep 'APP_KEY=' | tail -1 | tr -d '[:space:]')"

if [ -z "$KEY_LINE" ]; then
  echo "Could not parse APP_KEY from ace output."
  exit 1
fi

echo ""
echo "Add this to $ENV_FILE:"
echo "$KEY_LINE"

if [ -f "$ENV_FILE" ] && grep -q '^APP_KEY=' "$ENV_FILE"; then
  if grep -q '^APP_KEY=$' "$ENV_FILE" || grep -q '^APP_KEY=\s*$' "$ENV_FILE"; then
    sed -i "s|^APP_KEY=.*|$KEY_LINE|" "$ENV_FILE"
    echo "Updated empty APP_KEY in $ENV_FILE"
  fi
fi
