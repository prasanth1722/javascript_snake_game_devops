# Use official Node.js 18 image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install serve globally
RUN npm install -g serve

# Copy app source
COPY public ./public

# Serve the app on port 3000
CMD ["serve", "-s", "public", "-l", "3000"]
