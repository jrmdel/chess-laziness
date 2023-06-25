# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container (for better optimization)
# COPY package*.json ./
# Install project dependencies
# RUN npm install

# Copy the rest of the project files to the container
COPY . .

# Specify the command to run your application
CMD ["node", "main.js"]
