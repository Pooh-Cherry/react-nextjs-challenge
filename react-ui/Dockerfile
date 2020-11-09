# Specify a base image
FROM node:12

# Create app directory and use it as the working directory
RUN mkdir -p /usr/src/react-ui
WORKDIR /usr/src/react-ui

# Copy dependencies files
COPY package.json /usr/src/react-ui
COPY package-lock.json /usr/src/react-ui

# Install dependencies
# RUN npm install

# Copy remaining files
COPY . /usr/src/react-ui

# Default command
# CMD ["npm", "run", "start"]