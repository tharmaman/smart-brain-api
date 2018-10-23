# use node image from docker hub
# FROM node:carbon
FROM node:8.11.1

WORKDIR /usr/src/smart-brain-api

COPY ./ ./

# or npm install
RUN yarn install

# what to run in the container accessing its bash profile
CMD [ "/bin/bash" ]

# docker build -t superawesomecontainer .
# docker run -it superawesomecontainer
# -it command allows us to enter docker container

# docker run -it -d superawesomecontainer
# -d allows container to run in background

# docker ps
# see all containers running

# docker exec -it e68063bdaafc bash
# access container 

# docker stop e68063bdaafc
# stop container

# docker run -it -p 3000:3000 superawesomecontainer
# port forwarding port 3000 in container to 3000 on localhost