# ---------------------
# STAGE 1: BUILD STAGE
# ---------------------
# Use the official Node.js 18 Alpine image, which is lightweight and commonly used for building Node apps
FROM node:18-alpine AS builder

# Set the working directory inside the container to /app
WORKDIR /app

# Copy only the package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies listed in package.json
RUN npm install

# Copy the rest of the application code (your entire Next.js project)
COPY . .

# Build the Next.js app for production
# This will output a `.next` directory which contains the compiled site
RUN npm run build


# -------------------------
# STAGE 2: RUNTIME STAGE
# -------------------------
# Start with a clean, minimal Node.js 18 Alpine image for running the app
FROM node:18-alpine AS runner

# Set working directory for this final image
WORKDIR /app

# Make sure node_modules binaries like `next` are available
ENV PATH /app/node_modules/.bin:$PATH

# Copy the built `.next` output folder from the builder stage (compiled app code)
COPY --from=builder /app/.next ./.next

# Copy static assets like images, icons, etc.
COPY --from=builder /app/public ./public

# Copy the actual source files (important for dev mode + debugging)
COPY --from=builder /app/src ./src

# Copy config and metadata files necessary to run the app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/postcss.config.mjs ./postcss.config.mjs

# (Optional) If you use Tailwind CSS, include your config
# Remove this line if you don't use Tailwind
COPY --from=builder /app/tailwind.config.ts ./tailwind.config.ts

# missing line causing error sh: next: not found   
COPY --from=builder /app/node_modules ./node_modules

# Open port 3000 in the container (Next.js default port)
EXPOSE 3000

# Start the app in development mode (change to 'start' if using production server)
CMD ["npm", "run", "dev"]
