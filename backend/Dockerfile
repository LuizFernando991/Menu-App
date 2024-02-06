FROM node:latest

# Create app directory
WORKDIR /usr/app

# Install the dependecies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Run the application
EXPOSE 3000

CMD [ "npm", "run", "start" ]