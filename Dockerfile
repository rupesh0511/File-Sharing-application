#node version 20
FROM node:hydrogen-slim

#create a new folder called app
WORKDIR /app

#copy entire code into app
COPY  . /app
 
 #npm i

RUN npm i

 #node index.js

 CMD ["node","index.js"]