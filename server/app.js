const config = require('config');
const Koa = require('koa');
const cors = require('@koa/cors');
const Database = require('./routes/db.routes');

const app = new Koa();
let options = {
  origin: false,
  credentials: true,
};
app.use(cors(options));

app.use(Database.routes()).use(Database.allowedMethods());

const PORT = config.get('PORT') || 3000;

app.listen(PORT);