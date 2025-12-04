import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.join(__dirname, '../.env')});

 const config = {
    port: process.env.PORT,
    connectionStr: process.env.CONNECTION_STR,
}

export default config;