# Use Node.js LTS (Long Term Support) as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Accept MongoDB URI as build argument
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all files
COPY . .

# Build the Next.js application
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]