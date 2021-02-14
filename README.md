# DevAndDeliver recruitment task - node js

## Stack

- Typescript
- Koa.js
- MongoDB
- Redis


## Usage

### Requirements
 
- Node >= 12
- NPM
- Docker
- docker-compose >= 3.3

### Basic usage

API may be started using `docker-compose -d up`.
By default, the API will user port 4000. It can be changed using environmental variable `APP_PORT`.
Using this method the database and redis instances for the API will be created automatically. 

API can also be started directly. To achieve that, install all packages `npm i` and then it can be started in development mode by using `npm start`. No database or redis instance will be started in that case.

To supply your own database, use `DATABASE_URL` environmental variable for the address of the database. The same goes with redis address `REDIS_URL`

In both cases environmental variable `JWT_SECRET` may be provided to set the JWT secret used to decrypt authentication token. If none provided, `secret` will be used.

Debug mode can be turned on using `DEBUG` environmental variable. 

### API

##### `POST` /auth/login

**USAGE** : Logs in user

**INPUT** : 

 - Body
```
{
    login: string, 
    password:  string 
}
```

**OUTPUT** : Token for authorization. (See [authorization](#Authorization))

---

##### `POST` /auth/register

**USAGE** : Creates new user

**INPUT** :

- Body

```
{
    login: string, 
    password:  string 
}
```

**OUTPUT** : None

---

##### `GET` /movies

**USAGE** : Fetches list of movies associated with user's hero

**INPUT** :  None

**OUTPUT** : List of [movies](https://swapi.dev/documentation#films)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /movies/:id

**USAGE** : Fetches movie by id

**INPUT** :  Url `id:number`

**OUTPUT** : [Movie](https://swapi.dev/documentation#films)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /species

**USAGE** : Fetches list of species associated with user's hero

**INPUT** :  None

**OUTPUT** : List of [species](https://swapi.dev/documentation#species)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /species/:id

**USAGE** : Fetches species by id

**INPUT** :  Url `id:number`

**OUTPUT** : [Species](https://swapi.dev/documentation#species)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /vehicles

**USAGE** : Fetches list of vehicles associated with user's hero

**INPUT** :  None

**OUTPUT** : List of [vehicles](https://swapi.dev/documentation#vehicles)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /vehicles/:id

**USAGE** : Fetches vehicle by id

**INPUT** :  Url `id:number`

**OUTPUT** : [Vehicle](https://swapi.dev/documentation#vehicles)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /starships

**USAGE** : Fetches list of starships associated with user's hero

**INPUT** :  None

**OUTPUT** : List of [starships](https://swapi.dev/documentation#starships)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /starships/:id

**USAGE** : Fetches starship by id

**INPUT** :  Url `id:number`

**OUTPUT** : [Starship](https://swapi.dev/documentation#starships)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /planets

**USAGE** : Fetches list of planets associated with user's hero

**INPUT** :  None

**OUTPUT** : List of [planets](https://swapi.dev/documentation#planets)

ℹ Requires [Authorization](#Authorization)

---

##### `GET` /planets/:id

**USAGE** : Fetches planet by id

**INPUT** :  Url `id:number`

**OUTPUT** : [Planet](https://swapi.dev/documentation#planets)

ℹ Requires [Authorization](#Authorization)

---

## Authorization

Authorization is done by JWT token provided in `authorization` header. It should be in form `Bearer <token>`. 
