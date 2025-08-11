# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in package.json
RUN npm install

# Build the application
RUN npm run build

# Expose port 3000 on the host to port 3000 on the container
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]