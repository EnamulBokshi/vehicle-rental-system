import {Pool} from 'pg'
import config from '.'

export const pool = new Pool({
    connectionString: config.connectionStr
});


const initDB = async()=>{
    try {
        await pool.query(`
            
            `)
    } catch (error:any) {
        console.log("Database initialization failed: ", error.message)
    }
}

