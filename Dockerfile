FROM alpine:3.20 AS alpine_base
FROM golang:1.24-alpine3.20 AS golang_base

FROM golang_base AS golang-build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./main.go

FROM node:latest AS frontend-build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM alpine_base AS runtime

WORKDIR /app/

COPY --from=frontend-build /app/.output/dist ./dist

COPY --from=golang-build /app/server .

EXPOSE 80

ENTRYPOINT [ "/app/server","serve","--http=0.0.0.0:80" ]