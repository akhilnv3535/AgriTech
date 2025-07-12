#Dockerfile, image, container
FROM node:24-alpine

# Set working directory
WORKDIR /frontend

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port used by the dev server
EXPOSE 3000

# Start the React development server
CMD ["npm", "run", "dev"]