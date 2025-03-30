# Use the official lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy app source
COPY public ./public

# Use serve to run the app
CMD ["npx", "serve", "-s", "public"]
