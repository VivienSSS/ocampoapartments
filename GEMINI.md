# GEMINI.md

## Project Overview

This is a full-stack web application for managing apartment rentals. It uses a Go backend powered by **PocketBase** and a modern React frontend built with **Rsbuild**.

The backend provides a RESTful API and serves the frontend as a static site. The frontend is a single-page application (SPA) that uses **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** for its user interface. It uses **Tanstack Router** for routing and **Tanstack Query** for data fetching.

This project uses `just` as a command runner. The available commands are defined in the `justfile`.

## Building and Running

### Setup

*   **Install dependencies:**
    ```bash
    just setup
    ```

### Development

*   **Run the development servers (backend and frontend):**
    ```bash
    just dev
    ```
    This will start the PocketBase server and the Rsbuild development server with hot-reloading.
    The application will be available at `http://localhost:3000`.

### Other Commands

*   **Introspect the database and generate TypeScript types:**
    ```bash
    just introspect
    ```
*   **Build and push a Docker image:**
    ```bash
    just docker-push
    ```

## Development Conventions

*   **Backend:** The backend follows standard Go conventions. Database migrations are located in the `migrations` directory.
*   **Frontend:** The frontend uses **TypeScript** and **React**. Components are located in `src/components`. The project uses **Tailwind CSS** for styling and **shadcn/ui** for UI components. **Tanstack Router** is used for routing, with routes defined in the `src/routes` directory.
*   **API:** The frontend communicates with the backend via a RESTful API. The development server proxies requests from `/api` to the backend at `http://localhost:8090`.