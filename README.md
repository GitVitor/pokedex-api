# Pokemon API

This API provides access to some [pokeAPI](https://pokeapi.co/) endpoints.
You can list and search for specific pokemons based on its name.

That API was built using [NestJS](https://docs.nestjs.com/).

## openapi specs

To access openapi specifications run the [project locally](#running-local-development-mode) and access `http://localhost:3000/openapi`;

There you can get access to every endpoint and see a seamlessly documentation about
which endpoints are availabled, which params are accepted.


## pre-requisite

- NodeJS 20
- npm 10

## Install and running

To install run `npm install`

### Running local (development mode)

`npm run start` runs the API on port `3000` and you can access it through `http://localhost:3000`.

### Build

To build that project just runs `npm run build`


### Running with Docker

Give that your terminal is running inside the API folder, you have to build the project

- `docker build -t pokedex-api:1.0 ./`

And then run the built image using (port 3000 below)

- `docker run -p 3000:3000 pokedex-api:1.0`