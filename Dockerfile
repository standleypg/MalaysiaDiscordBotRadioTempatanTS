# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# install the TypeScript code
RUN npm install

# Expose the port that the application will listen on
EXPOSE 8001

# Start the application
CMD ["npm", "start"]
