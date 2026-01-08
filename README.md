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
4. Setup the DB
```
docker compose -f docker-compose.yaml up -d
```
5. Clone the file ```.env.template``` and rename the copy for ```.env```

6. Fill the enviroment variables defined in the ```.env``` file

7. Run the API with
```
pnpm start:dev
```
8. Run seed
```
localhost:3000/api/v1/seed
```