#!/bin/sh
set -e

# Generate runtime config from environment variables
# This script runs in /docker-entrypoint.d/ before nginx starts

cat > /usr/share/nginx/html/config.js << EOF
window.__CONFIG__ = {
  API_URL: "${API_URL:-}",
  OIDC_ENABLED: "${OIDC_ENABLED:-true}",
  OIDC_AUTHORITY: "${OIDC_AUTHORITY:-}",
  OIDC_CLIENT_ID: "${OIDC_CLIENT_ID:-}",
};
EOF

echo "Runtime config generated:"
cat /usr/share/nginx/html/config.js
