import { pool } from "../../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import config from "../../config";
const signUP = async(payload: Record<string, unknown>) =>{
    
    const {name,phone,email,password,role} = payload;
    
    if(!name || !phone || !email || !password || !role) {
        throw Error('One or more properties are missing!!')
    };

    if((password as string).length < 6 ) {
        throw Error('Password can\'t be less than 6 characters');
    };

    if((role as string) !== 'customer' || (role as string) !== 'admin') {
        throw Error("Role must either 'customer' or 'admin' ");
    }
    
    
    const hashedPassword = await bcrypt.hash(password as string, 10);
    
    return pool.query(`
        INSERT INTO users(name, email, password, phone, role) VALUES ($1, $2, $3, $4,$5) RETURNING *
        `,[name,(email as string).toLowerCase(), hashedPassword, phone, role])
}

const login = async(email: string, password: string) => {
    if(!email || !password) return null;
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [(email as string).toLowerCase()]);
    if(result.rows.length == 0) {
        throw Error("Password can't be empty!!");
    }
    const user = result.rows[0];
    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched) {
        throw Error('Incorrect Credentials!!')
    }
    const userToBeReturned =  {id: user.id, name: user.name, email: user.email, phone: user.phone,role: user.role, }
    const token = jwt.sign(userToBeReturned, config.jwtSecret as string,{expiresIn: '7d'});
    return {token, userToBeReturned};
}



 const authServices = {
    signUP, 
    login
}

export default authServices;