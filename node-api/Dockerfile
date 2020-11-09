# Specify a base image
FROM node:12

# Create app directory and use it as the working directory
RUN mkdir -p /usr/src/node-api
WORKDIR /usr/src/node-api

# Copy dependencies files
COPY package.json /usr/src/node-api
COPY package-lock.json /usr/src/node-api

# Install dependencies
# RUN npm install

# Copy remaining files
COPY . /usr/src/node-api

# Default command
# CMD ["npm", "run", "dev"]