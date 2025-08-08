// db.js
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,          // 192.168.87.245
  port: Number(process.env.DB_PORT),  // 3306
  user: process.env.DB_USER,          // root
  password: process.env.DB_PASSWORD,  // casaos
  database: process.env.DB_NAME,      // motorcredito
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_POOL_SIZE ?? '10', 10),
  queueLimit: 0,
  enableKeepAlive: true,
  dateStrings: true,                  // evita bagunça de timezone em DATETIME
});
