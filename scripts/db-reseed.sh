set -e

echo "🧹 Cleaning databases..."
bun db:clean > /dev/null

echo "📤 Pushing schema..."
bun db:push > /dev/null

echo "🌱 Seeding data..."
# We need to start the server in order to seed
# Seeding interacts with the API rather than with the
# DB directly in order to avoid reproducing server logic
bun dev:server > /dev/null &
SERVER_PID=$!

# Wait for server to be ready
sleep 2

bun db:seed

kill $SERVER_PID

echo "✅ Done!"
