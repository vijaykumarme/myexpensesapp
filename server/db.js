// const {Pool} = require("pg");

//Production 
// const pool = new Pool();
// module.exports = {
//   query: (text,params) => pool.query(text,params)
// }

//Development
const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "Kumar@369*",
  host: "172.232.105.210",
  database: "myexpenses",
  port: 5432
})

module.exports = pool;