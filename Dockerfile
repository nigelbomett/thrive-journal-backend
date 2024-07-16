# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Set environment variables (optional if using .env file)
ENV NODE_ENV=production
ENV PORT=25234

# Expose the port the app runs on
EXPOSE 25234

# Define the command to run the app
CMD ["npm", "start"]
