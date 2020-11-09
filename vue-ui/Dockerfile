# Specify a base image
FROM node:12

# Create app directory and use it as the working directory
RUN mkdir -p /usr/src/vue-ui
WORKDIR /usr/src/vue-ui

# Copy dependencies files
COPY package.json /usr/src/vue-ui
COPY package-lock.json /usr/src/vue-ui

# Install dependencies
# RUN npm install

# Copy remaining files
COPY . /usr/src/vue-ui

# Default command
# CMD ["npm", "run", "serve"]