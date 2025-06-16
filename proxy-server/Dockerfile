# Base image
FROM node:18

# Working directory inside container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy your backend code
COPY . .

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=3001

# Expose the port used by the backend
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]
