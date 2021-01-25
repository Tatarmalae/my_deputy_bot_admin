const config = require('config');
const mysql = require('mysql2');

const ADDRESS = config.get('ADDRESS');
const PARTY = config.get('PARTY');

let pool = {};

pool.connectAddress = mysql.createPool(ADDRESS);
pool.connectAddress.getConnection(async (err, connection) => {
  if (err) throw err;
  connection.release();
});

pool.connectParty = mysql.createPool(PARTY);
pool.connectParty.getConnection((err, connection) => {
  if (err) throw err;
  connection.release();
});


module.exports = pool;