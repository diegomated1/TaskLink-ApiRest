# TaskLink-ApiRest

TaskLink-ApiRest are the api rest for a app movil

## Installation

Create postgress database with the following script [database](https://github.com/diegomated1/TaskLink-ApiRest/blob/dev/src/app.ts), that script create the database for this proyect


Add .env file in the root of the proyect, the next table respresent all posible enviorent varaibles

ENVIORENT | Description | Required | Default
--- | --- | --- | --- 
POSTGRES_CONECTIONSTRING_DEBUG | Postgress connection string for testing | N |
POSTGRES_CONECTIONSTRING | Postgress connection string production | Y |
API_HOST | Api host | N | "localhost"
API_HTTP_PORT | Api port | N | "3000" | 286
JWT_SECRET | Json web token secret token | Y | 
ENVIORENT | Variable for check app enviorent | N | "development"

Install all dependencies with [npm](https://www.npmjs.com)

```bash
npm install
```

Execute test for make sure the proyect are good

```bash
npm test
```

Start the proyect

```bash
npm start
```

And open in the browser the next link: http://localhost:3000/swagger

## License

[MIT](https://choosealicense.com/licenses/mit/)
