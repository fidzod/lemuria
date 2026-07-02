set -e

echo "🔍 Checking server..."
bun check:server

echo "🔍 Checking client..."
bun check:client

echo "✅ All checks passed!"

