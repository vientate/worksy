import {Client} from 'pg';
import dotenv from 'dotenv';
dotenv.config();


console.log('Пароль для pg: ', process.env.PGPASSWORD);



const pool = new Client();
await pool.connect();

//const { Client } = pkg;

// const pool = new Pool({
//   user: process.env.PGUSER,
//   host: process.env.PGHOST,
//   database: process.env.PGDATABASE,
//   password: String(process.env.PGPASSWORD),
//   port: Number(process.env.PGPORT),
// });



export default pool;
