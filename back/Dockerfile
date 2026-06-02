# syntax=docker/dockerfile:1.7

# ---- Stage 1: builder ----
# TODO:
#   - Set the working directory
#   - Install all dependencies (including dev deps needed to compile)
#   - Copy TypeScript config files (tsconfig*.json, nest-cli.json) and the src/ folder
#   - Run the production build (compile TS into dist/)
FROM node:20-alpine AS builder

# ---- Stage 2: runtime ----
# TODO:
#   - Set the working directory
#   - Set NODE_ENV=production
#   - Install only production dependencies
#   - Copy the compiled dist/ from the builder stage
#   - EXPOSE the app port and start the server (node dist/main.js)
FROM node:20-alpine AS runtime
