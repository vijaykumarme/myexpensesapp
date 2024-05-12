// const {Pool} = require("pg");

// const pool = new Pool();
// module.exports = {
//   query: (text,params) => pool.query(text,params)
// }

const Pool = require("pg").Pool;

const pool = new Pool({
    user: 'postgres',
    password: 'Kumar@369*',
    host: '172.232.123.22',
    database: 'myexpenses',
    port: 5432
});

module.exports = pool;