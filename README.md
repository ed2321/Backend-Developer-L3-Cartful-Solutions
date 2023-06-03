[![ci-api](https://github.com/ed2321/Backend-Developer-L3-Cartful-Solutions/actions/workflows/ci-api.yaml/badge.svg?branch=main)](https://github.com/ed2321/Backend-Developer-L3-Cartful-Solutions/actions/workflows/ci-api.yaml)
# Backend-Developer-L3-Cartful-Solutions
Prueba Práctica Backend Developer L3 Cartful-Solutions
# Prerequisites
* Git
* node js
* Optional Docker

### Installation

Open a terminal in the root of the project:

```
cd src && npm i
```
### Usage
Before launching the application, make sure to add the respective `.env` file inside the `/src` path


run the app with docker (recommended)
```
docker-compose up --build
```
run aplication 
```
npm run start
```

or if you want to run it in a development mode, try with this:

```
npm run start:dev
```
## Endpoints
POST api/users/login
```
curl --request POST \
  --url http://0.0.0.0:4000/api/users/login \
  --header 'Content-Type: application/json' \
  --data '{
	"email": "edinson.duran@gmail.com",
	"password": "123456"
}'
```

POST api/users/login

```
curl --request POST \
  --url http://0.0.0.0:4000/api/users/register \
  --header 'Content-Type: application/json' \
  --data '{
	"firstName": "edinson",
	"lastName": "duran",
	"email": "edinson.duran@gmail.com",
	"password": "123456"
}'
```

POST api/products/register
```
curl --request POST \
  --url http://0.0.0.0:4000/api/products/register \
  --header 'Content-Type: application/json' \
  --header 'x-access-token: test_token' \
  --data '{
	"name": "test product",
	"url": "test",
	"image": "test",
	"price": "1",
	"color": "green",
	"category": "zapatos",
	"status": "activo"
}'
```
GET api/products/:sku
```
curl --request GET \
  --url http://0.0.0.0:4000/api/products/a8a9eb81-5f76-4eed-8a9f-7508a45d2803 \
  --header 'x-access-token: test_token'
```
PUT api/products/:sku
```
curl --request PUT \
  --url http://0.0.0.0:4000/api/products/cfc1ee61-e784-49a2-9f4c-48bff8358c076666555666 \
  --header 'Content-Type: application/json' \
  --header 'x-access-token: test_token' \
  --data '{
		"image": "test",
		"color": "blue",
		"price": "10000",
		"name": "test product 13 -- update22222",
		"category": "zapatos",
		"url": "test",
		"status": "activo"
}'
```
DELETE /api/products/:sku
```
curl --request DELETE \
  --url http://0.0.0.0:4000/api/products/a8a9eb81-5f76-4eed-8a9f-7508a45d2803 \
  --header 'Content-Type: application/json' \
  --header 'x-access-token: test_token
  '
```
GET api/products/getAll?limit=5&offset=1
```
curl --request GET \
  --url 'http://0.0.0.0:4000/api/products/getAll?limit=5&offset=1' \
  --header 'x-access-token: test_token'
```
POST api/products/like/:sku

```
curl --request POST \
  --url http://0.0.0.0:4000/api/products/like/df954307-8c84-47d4-b941-b76eb0c6516b \
  --header 'x-access-token: test_token'
```
POST api/products/dislike/:sku

```
curl --request POST \
  --url http://0.0.0.0:4000/api/products/dislike/53da3f39-dc2c-4507-97c2-59186d614e8b \
  --header 'x-access-token: test_token'
```
GET api/products/recommend
```
curl --request GET \
  --url http://0.0.0.0:4000/api/products/recommend \
  --header 'x-access-token: test_token'
```
marketing team inquiries

GET api/products/most-liked
```
curl --request GET \
  --url http://0.0.0.0:4000/api/products/most-liked \
  --header 'x-access-token: test_token'
```

GET api/products/most-disliked
```
curl --request GET \
  --url http://0.0.0.0:4000/api/products/most-disliked \
  --header 'x-access-token: test_token'
```
Plus - Problema #4: Infraestructura

Objetivo: Definir una estrategia de despliegue de la aplicación en AWS. Instrucciones
1. Definir una estrategia para desplegar estaa plicación en AWS. 
Para desplegar esta aplicación en AWS, se utilizará una arquitectura serverless, lo que significa que no será necesario administrar servidores ni infraestructura subyacente. Esto brinda mayor flexibilidad y escalabilidad. 

2. ¿Qué servicios de AWS utilizaría y porqué?
* DynamoDB se utilizará como base de datos para almacenar los datos de los productos, como nombres, precios, categorías, etc. Lambda interactuará con DynamoDB para leer y escribir los datos necesarios.

* Lambda se utilizará para ejecutar el código de la lógica de negocio de la aplicación. Recibirá las solicitudes de los usuarios a través de API Gateway, procesará los datos necesarios y realizará las operaciones correspondientes en DynamoDB.

* API Gateway actuará como puerta de enlace de la API RESTful. Recibirá las solicitudes de los usuarios y las dirigirá a Lambda para su procesamiento. También se encargará de la autenticación y autorización de los usuarios, asegurando la seguridad de la API.

* S3 se utilizará para almacenar las imágenes de los productos. Cuando un producto se registre o actualice, Lambda guardará la imagen correspondiente en S3 y asociará su ubicación con el producto en DynamoDB.

* CloudFront se integrará con S3 para proporcionar una entrega de contenido rápida y eficiente. Cuando un usuario solicite una imagen de producto, CloudFront se encargará de entregarla desde la ubicación más cercana, acelerando la carga de la imagen y mejorando la experiencia del usuario.

En resumen, esta estrategia de despliegue en AWS aprovecha los servicios serverless para lograr una aplicación escalable y de alto rendimiento.

### npm scripts

- `npm start`: Run the application without restarting when files changes.
- `npm run start:dev` : Run the application and automatically restarts when files changes.
- `npm run lint`: Inspect code styles errors in the javascript files (also detect prettier format errors)
- `npm run format`: detect prettier formatting errors and fixes them
- `npm run test`: Run unit tests
- `npm run test:watch`: Run unit tests and automatically restarts when `*.test.js` files changes.
- `npm run test:coverage`: Run test coverage.
- `npm run test:ci`: Run test continuos integration.
