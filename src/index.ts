import express from 'express';

import { useRoutes } from './routes';

const app = express()
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const port = 3000

useRoutes(app);

module.exports = app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});
