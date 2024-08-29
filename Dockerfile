FROM node:slim
WORKDIR /src
COPY . /src
RUN npm install
CMD node app.js