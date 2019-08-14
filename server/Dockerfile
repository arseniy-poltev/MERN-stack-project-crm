FROM node:9.6.1

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# COPY package*.json ./

# RUN npm install --quiet
RUN npm install -g nodemon
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
# COPY . .

# EXPOSE 8080
CMD [ "npm", "start" ]
