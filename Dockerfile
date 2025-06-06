# Use the official Node.js image.
FROM node:20-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install --force

# Copy local code to the container image.
COPY . .

# Expose the port the app runs on.
EXPOSE 4000

# Run the web service on container startup.
CMD [ "npm", "start" ]
