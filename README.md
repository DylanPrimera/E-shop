<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Eshop API
1. Clone the repository
2. You must have Nest CLI installed
```
pnpm i -g @nestjs/cli
```
3. Run 
``` 
pnpm install

```
4. Clone ```.env.template``` and rename the copy for ```.env```
5. Fill the enviroment variables defined in the ```.env``` file
6. Setup the DB
```
docker compose up -d
```
7. Run the API with
```
pnpm start:dev
```
8. Run seed on postman
```
localhost:3000/api/v1/seed
```

# Web socket client

If you want to test locally the websocket feature go to ```https://github.com/DylanPrimera/websocket-client``` and follow the instructions