FROM node

RUN mkdir /home/project
RUN mkdir /home/project/Frontend
COPY . /home/project/Frontend/
WORKDIR /home/project/Frontend/
RUN ls -r
RUN npm install
RUN npm install bootstrap@5
RUN npm install @popperjs/core
RUN npm install -g serve
RUN npm run build
RUN apt update
RUN apt install xsel

EXPOSE 3000

ENTRYPOINT [ "serve", "-s", "dist" ]
