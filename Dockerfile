FROM vuejs/ci

RUN mkdir /home/project
COPY . /home/project
WORKDIR /home/project/Frontend
RUN npm install
RUN npm install bootstrap@5
RUN npm install @popperjs/core
RUN npm install -g serve
RUN npm run build

EXPOSE 3000

ENTRYPOINT [ "serve", "-s", "dist" ]
