FROM vladr2001/idpfrontend_01:0.0.1

WORKDIR /home/project/Frontend
RUN git pull
RUN npm install

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "dev", "--", "--host" ]