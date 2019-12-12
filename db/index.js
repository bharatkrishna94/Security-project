const pgp = require("pg-promise")();
const connection = pgp(global.env.DATABASE_URL);
module.exports = connection;
