# COP4331-SmallProject

COP 4331 Small Team Project for Group 23.

## Run Local Instance

If you have Docker you can run a local instance of the frontend.

**Start Docker Container**

```
bash start-docker.sh
```

Visit [http://localhost:8080/](http://localhost:8080/)

**Update Docker Container**

Get the id of the current container.

```
docker ps
```

Send the container id as an argument to the restart script.

```
bash restart-docker.sh <container id>
```