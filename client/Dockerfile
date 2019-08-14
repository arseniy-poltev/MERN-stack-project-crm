# base image
FROM node:8.14-jessie

# set working directory
RUN mkdir /usr/app
WORKDIR /usr/app

# add `/usr/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/app/package.json
RUN npm install
RUN npm install react-scripts@1.1.1 -g

# start app
CMD ["npm", "start"]