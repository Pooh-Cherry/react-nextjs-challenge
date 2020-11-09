# Code challenge project by Node.JS and React
This is a simple demonstration project to mange contact including name, and phone number.

Backend: written by Node.JS & Redis (Storage)

Frontend: by React (Test by Jest) & Vue (Test by Cypress but not implemented)

## Installation
Use the docker to create development environment.

## Development
```bash
docker-compose up --build
```
This will install all packages and run servers per each containers (node-api, react-ui, vue-ui). </br>

Docker Containers Naming & URL </br>
node-api : challenge-app-server - localhost:5000</br>
react-ui : challenge-app-react - localhost:3000 </br>
vue-ui   : challenge-app-vue - localhost:8080 </br>

### React Test
```bash
docker exec -it challenge-app-react /bin/bash
npm run test
```
