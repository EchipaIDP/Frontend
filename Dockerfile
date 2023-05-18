FROM vuejs/ci

RUN mkdir /home/project
COPY . /home/project
WORKDIR /home/project/Frontend
RUN npm install
RUN npm install bootstrap@5
RUN npm install @popperjs/core

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]
