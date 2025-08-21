set dotenv-load := true

APP_NAME := `cat package.json | jq -r '.name'`
APP_VERSION := `cat package.json | jq -r '.version'`

setup:
  @go mod tidy
  @bun install --frozen-lockfile

introspect:
  @bunx pocketbase-typegen --db ./pb_data/data.db -o src/pocketbase/types.ts

dev-go:
  @go run main.go serve

dev-frontend:
  @bun rsbuild dev --open

dev:
  @bun concurrently 'just dev-go' 'just dev-frontend' -n 'pocketbase,rsbuild'

docker-build:
  @if docker manifest inspect ${REGISTRY_URL}/{{APP_NAME}}:{{APP_VERSION}} > /dev/null 2>&1; then \
    echo "Error: Image ${REGISTRY_URL}/{{APP_NAME}}:{{APP_VERSION}} already exists" 1>&2; \
    exit 1; \
  fi
  @docker build -t ${REGISTRY_URL}/{{APP_NAME}}:{{APP_VERSION}} .

docker-push: docker-build
  @docker push ${REGISTRY_URL}/{{APP_NAME}}:{{APP_VERSION}}