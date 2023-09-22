# TaskLink-ApiRest

TaskLink-ApiRest are the api rest for a app movil

## Installation

Create postgress database with the following script [database](https://github.com/diegomated1/TaskLink-ApiRest/blob/dev/src/app.ts), that script create the database for this proyect


Add .env file in the root of the proyect, the next table respresent all posible enviorent varaibles

Name | Description | Required | Default | Values
--- | --- | --- | --- | ---
POSTGRES_CONECTIONSTRING_DEV | Postgress connection string for testing | N | |
POSTGRES_CONECTIONSTRING | Postgress connection string production | Y | |
API_HOST | Api host | N | localhost |
API_HTTP_PORT | Api port | N | 3000 |
JWT_SECRET | Json web token secret token | Y | |
ENVIRONMENT | Variable for check app enviorent | N | development | test, production, development
EMAIL_USER | Email user, it will be used to send emails | Y | |
EMAIL_PASSWORD | Email password | Y | |
GOOGLE_API_MAPS_URL | Google maps api base url | Y | | https://maps.googleapis.com
GOOGLE_API_KEY | Google api key | Y | |

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
