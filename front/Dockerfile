# syntax=docker/dockerfile:1.7

# ---- Stage 1: builder ----
# TODO:
#   - Set the working directory
#   - Declare a build argument VITE_API_URL and expose it as an env var
#     (Vite bakes env vars into the bundle at build time)
#   - Install all dependencies
#   - Copy the source code
#   - Run the production build (static files go to dist/)
FROM node:20-alpine AS builder

# ---- Stage 2: nginx runtime ----
# TODO:
#   - Copy the built static files from the builder stage to nginx's html dir
#   - Copy the custom nginx.conf into /etc/nginx/conf.d/
#   - EXPOSE port 80 and run nginx in the foreground
FROM nginx:alpine AS runtime
