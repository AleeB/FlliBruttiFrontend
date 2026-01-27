# Sorgenti e configurazione

## Sorgenti applicazione

### Frontend (Angular)
- Root: `FlliBruttiFrontend`
- Sorgenti: `FlliBruttiFrontend/src`
- Principali aree:
  - `FlliBruttiFrontend/src/app/pages` (pagine)
  - `FlliBruttiFrontend/src/app/services` (servizi)
  - `FlliBruttiFrontend/src/app/models` (modelli)
  - `FlliBruttiFrontend/src/app/auth` (guard e interceptor)

### Backend (.NET 8)
- Root: `FlliBruttiBackend/FlliBruttiBackend/backend`
- Soluzione: `backend.sln`
- Progetti:
  - `FlliBrutti.Backend.API` (Web API)
  - `FlliBrutti.Backend.Application` (servizi, DTO, mapping)
  - `FlliBrutti.Backend.Core` (modelli dominio)
  - `FlliBrutti.Backend.Infrastructure` (EF Core, DB)
  - `FlliBrutti.Backend.Test` (test)

## File YAML di configurazione

### `FlliBruttiFrontend/docker-compose.local.yml`
```yaml
services:
  frontend-build:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./FlliBruttiFrontend:/app
      - /app/node_modules
      - frontend_dist:/app/dist
    command: sh -c "npm ci && npm run build -- --output-path=dist"
    networks:
      - app-net

  nginx:
    image: nginx:1.27-alpine
    depends_on:
      - frontend-build
    ports:
      - "0.0.0.0:8081:80"
    volumes:
      - frontend_dist:/usr/share/nginx/html:ro
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - app-net

volumes:
  frontend_dist:

networks:
  app-net:
    external: true
```

### `FlliBruttiFrontend/docker-compose.yml`
```yaml
version: '3.8'

services:
  frontend:
    image: ${REGISTRY:-ghcr.io}/${REPO_OWNER}/${IMAGE_NAME}:${TAG:-latest}
    container_name: ${CONTAINER_NAME}
    ports:
      - "${FRONTEND_PORT:-80}:80"
    networks:
      - app-net
    restart: unless-stopped

networks:
  app-net:
    external: true
```

### `.github/workflows/frontend-ci-cd.yml`
```yaml
name: frontend-ci-cd

on:
  push:
    branches: [main]
    paths:
      - "FlliBruttiFrontend/**"
      - "nginx/**"
      - "dockerfile"
      - "docker-compose.yml"
      - ".github/workflows/frontend-ci-cd.yml"
  pull_request:
    paths:
      - "FlliBruttiFrontend/**"
      - "nginx/**"
      - "dockerfile"
      - "docker-compose.yml"
      - ".github/workflows/frontend-ci-cd.yml"
  workflow_dispatch:

permissions:
  contents: read
  packages: write

env:
  REGISTRY: ghcr.io
  FRONTEND_DIR: FlliBruttiFrontend
  NODE_VERSION: 20

jobs:
  ci:   #cd
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ${{ env.FRONTEND_DIR }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
          cache-dependency-path: ${{ env.FRONTEND_DIR }}/package-lock.json
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      

  docker:
    needs: ci
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set image name lowercase
        run: echo "IMAGE_NAME=$(echo ${{ github.repository_owner }}/fllibrutti-frontend | tr '[:upper:]' '[:lower:]')" >> $GITHUB_ENV
      
      - name: Login to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Build and push image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./dockerfile
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
```
