# Frontend

Commands for running docker:
docker build . -t img_name
docker run -dit -p 3000:3000 --name whatever img_name
docker exec whatever bash -c "cd /home/project/Frontend && npm run dev -- --host"
