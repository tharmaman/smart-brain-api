# use node image from docker hub
# FROM node:carbon
FROM node:8.11.1

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