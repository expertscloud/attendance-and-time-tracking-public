#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="/opt/Tickly"
BINARY_PATH="$INSTALL_DIR/tickly"
SANDBOX_PATH="$INSTALL_DIR/chrome-sandbox"
LAUNCHER_PATH="/usr/bin/tickly"

if [ -f "$SANDBOX_PATH" ]; then
  chown root:root "$SANDBOX_PATH"
  chmod 4755 "$SANDBOX_PATH"
fi

if [ -e "$LAUNCHER_PATH" ] || [ -L "$LAUNCHER_PATH" ]; then
  rm -f "$LAUNCHER_PATH"
fi

cat <<'EOF' > "$LAUNCHER_PATH"
#!/usr/bin/env bash
exec "/opt/Tickly/tickly" --no-sandbox --no-zygote --disable-gpu-sandbox "$@"
EOF
chmod 755 "$LAUNCHER_PATH"
