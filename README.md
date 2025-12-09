# Ocampo Apartments System

A comprehensive property management system built with a modern full-stack architecture. This system manages tenants, apartments, bills, maintenance requests, payments, and announcements.

**Version**: 0.33.0

---


## 🏗️ System Overview

Ocampo Apartments is a full-stack property management application consisting of:

- **Frontend**: Modern React SPA with real-time data synchronization
- **Backend**: Go server with PocketBase for data management and authentication
- **Database**: SQLite with PocketBase ORM
- **Deployment**: Docker containerization for easy deployment

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Rsbuild (Rspack-based)
- **Routing**: TanStack Router with file-based routing
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + AutoForm with Zod validation
- **UI Components**: Radix UI primitives
- **Styling**: TailwindCSS + PostCSS
- **Tables**: TanStack React Table
- **Dev Tools**: Router DevTools for debugging

### Backend
- **Language**: Go 1.24.2
- **Framework**: PocketBase 0.29.2 (BaaS)
- **Authentication**: JWT-based
- **Database**: SQLite with migrations
- **Interceptors**: Custom Go interceptors for business logic

### DevOps
- **Containerization**: Docker with multi-stage builds
- **Task Runner**: Just command runner
- **Runtime**: Alpine Linux + Node + Go

---

## 📦 Prerequisites

Before setting up the system, ensure you have the following installed:

### Required
- **Go**: 1.24 or higher ([download](https://golang.org/dl/))
- **Node.js**: 18 LTS or higher ([download](https://nodejs.org/))
- **Bun** (recommended): Fast package manager ([install](https://bun.sh/))
  - Or use **npm** if you prefer (slower but compatible)

### Optional
- **Docker**: For containerized deployment ([install](https://docs.docker.com/get-docker/))
- **Just**: Command runner for convenience ([install](https://github.com/casey/just))
- **Git**: For version control

### System Requirements
- **OS**: Linux, macOS, or Windows (WSL2)
- **Disk Space**: ~2GB for dependencies
- **Memory**: 2GB minimum recommended
- **Network**: Required for package downloads

---

## 🚀 Initial Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/VivienSSS/ocampoapartments.git
cd ocampoapartments
```

### Step 2: Install System Dependencies

#### Using Just (recommended)
```bash
just setup
```

This command will:
- Install Go (if using Linux with snap)
- Install Bun package manager
- Install Go dependencies (`go mod tidy`)
- Install Node dependencies (`bun install --frozen-lockfile`)

#### Manual Installation

If you prefer manual setup:

**Go dependencies:**
```bash
go mod download
go mod tidy
```

**Node dependencies:**
```bash
# Using Bun (faster)
bun install --frozen-lockfile

# Or using npm
npm install --legacy-peer-deps

# Or using pnpm
pnpm install
```

### Step 3: Environment Configuration

Create a `.env.local` file in the project root (optional, for customization):

```bash
# Backend port (default: 8090)
BACKEND_PORT=8090

# Frontend port (default: 3000)
FRONTEND_PORT=3000

# Database path (default: ./pb_data)
DATABASE_PATH=./pb_data

# Environment
NODE_ENV=development
```

### Step 4: Database Initialization

The PocketBase database is automatically initialized on first run. To manually set it up:

```bash
go run main.go migrate
```

This runs all pending migrations from the `migrations/` directory.

---

## 💻 Development Workflow

### Option 1: Using Just (Recommended)

**Start the full development server** (both frontend and backend):
```bash
just dev
```

This runs:
- Backend PocketBase server on `http://localhost:8090`
- Frontend Rsbuild dev server on `http://localhost:3000`

**Start only the backend:**
```bash
just dev-go
```

**Start only the frontend:**
```bash
just dev-frontend
```

The `--open` flag automatically opens the app in your browser.

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```bash
go run main.go serve
```

**Terminal 2 - Frontend:**
```bash
# Using Bun
bun rsbuild dev --open

# Or using npm/pnpm
npm run dev
# or
pnpm dev
```

### Frontend URLs
- **App**: http://localhost:3000
- **Backend API**: http://localhost:8090/api
- **PocketBase Admin**: http://localhost:8090/_/
- **Dev Tools**: http://localhost:3000 (includes React Router DevTools)

### API Proxy Configuration

The frontend is configured to proxy requests to the backend:

```typescript
// rsbuild.config.ts
server: {
  proxy: {
    '/api': 'http://localhost:8090',
  },
},
```

---

## 🔄 Database Type Generation

Generate TypeScript types from PocketBase schema:

```bash
just introspect
```

This creates `src/pocketbase/types.ts` with type-safe database access.

---

## 🏗️ Building & Deployment

### Development Build

```bash
just build
```

Creates:
- `.output/dist/` - Frontend build artifacts
- `.output/server` - Go binary

### Docker Build

#### Build the image:
```bash
# Set registry URL
export REGISTRY_URL=your-registry

# Build Docker image
just docker-build
```

The Docker image includes:
- **Stage 1**: Alpine base
- **Stage 2**: Go builder (builds backend)
- **Stage 3**: Node builder (builds frontend)
- **Stage 4**: Runtime (minimal Alpine with built artifacts)

#### Run the Docker container:
```bash
docker run -p 80:80 your-registry/ocampo-apt-system:0.33.0
```

Access at `http://localhost`

#### Push to registry:
```bash
just docker-push
```

### Manual Docker Build:
```bash
docker build -t ocampo-apt-system:latest .

# Run
docker run -p 8090:80 -v ocampo-data:/app/pb_data ocampo-apt-system:latest
```

---

## 📊 Database Management

### Database Location
- **File**: `./pb_data/data.db` (SQLite)
- **Collections**: Auto-managed by PocketBase
- **Backups**: Stored in `./pb_data/` directory

### PocketBase Admin Dashboard
Access the admin panel at: `http://localhost:8090/_/`

### Database Operations

**View migrations:**
```bash
ls -la migrations/
```

**Create new migration:**
```bash
go run main.go migrate create --name "migration_description"
```

**Drop database (careful!):**
```bash
# Remove the database file
rm ./pb_data/data.db

# Restart the server to recreate
go run main.go serve
```

---

## 🔧 Development Utilities

### Build Tools

**Biome** (code quality):
- Configuration: `biome.json`
- Check code: `bun run biome check .`

**TypeScript**:
- Configuration: `tsconfig.json`
- Strict mode enabled for type safety

### Project Scripts

Available scripts in `package.json`:

```bash
# Build production frontend
pnpm build

# Development mode (with Rsbuild)
pnpm dev

# Preview production build
pnpm preview

# Additional scripts
bun rsbuild dev  # with Bun
```

### Configuration Files

- `rsbuild.config.ts` - Rsbuild & Rspack configuration
- `tsconfig.json` - TypeScript compiler settings
- `biome.json` - Code quality settings
- `components.json` - Component configuration
- `go.mod` / `go.sum` - Go dependencies

---

## 📁 Project Structure

```
ocampoapartments/
├── src/                    # Frontend React source
│   └── pocketbase/         # PocketBase types (generated)
├── interceptor/            # Go business logic
├── migrations/             # Database migrations
├── pb_data/               # SQLite database and uploads
├── public/                # Static assets
├── templates/             # Go templates (if any)
├── main.go                # Go entry point
├── go.mod / go.sum        # Go dependencies
├── package.json           # Node dependencies
├── rsbuild.config.ts      # Build configuration
├── justfile               # Task definitions
└── Dockerfile             # Container configuration
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Frontend (3000) or Backend (8090) already running:**
```bash
# Find process using port 3000
lsof -i :3000
kill -9 <PID>

# Find process using port 8090
lsof -i :8090
kill -9 <PID>
```

Or specify a different port:
```bash
# Backend
go run main.go serve --http=localhost:9000

# Frontend
bun rsbuild dev --host localhost --port 3001
```

### Dependencies Installation Failed

**Node packages:**
```bash
# Clear cache and reinstall
bun install --no-save
# or
npm cache clean --force && npm install --legacy-peer-deps
```

**Go modules:**
```bash
go mod clean -modcache
go mod tidy
go mod download
```

### Database Corruption

**Reset database:**
```bash
rm -rf pb_data/data.db
go run main.go serve  # Recreates database
```

### Type Errors in Frontend

**Regenerate PocketBase types:**
```bash
just introspect
```

### Backend Connection Refused

Ensure both servers are running and check logs:
```bash
# Backend logs
go run main.go serve 2>&1 | grep -i error

# Frontend proxy issues (check browser console)
# Look for CORS or proxy errors
```

### Build Failures

**Clear build cache:**
```bash
# Frontend
rm -rf .output/
bun install

# Go
go clean -cache
go mod tidy
```

---

## 🤝 More Information:

For contributions and issues, please visit the [GitHub repository](https://github.com/VivienSSS/ocampoapartments).

## PocketBase Subdomain Link (for creating users and checking)
## This will be helpful for Figure 2.17 on the User Manual
https://ocampoapartments.live/_/#/login


## user Accounts for Login

Administrator:
email - admin123@email.com
password - password123

Building Administrator:
email - bldgadmin123@email.com
password - password123

Tenant:
email - tenant123@email.com
password - password123




