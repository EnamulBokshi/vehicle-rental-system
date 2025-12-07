import { pool } from "../../config/db";
import bcrypt from 'bcryptjs'
const getAllUsers = async()=>{
    return await pool.query(`SELECT id, name, email, phone, role FROM users`);
}

const getUser = async(id: string) =>{
    return await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
}
const updateUser = async(id:string,payload: Record<string, unknown>) => {
    const fieldToUpdate = [];
    const values = [];
    let count = 1;

    if(payload.name !== undefined){
        fieldToUpdate.push(`name=$${count++}`);
        values.push(payload.name);
    }
    if(payload.email !== undefined){
        fieldToUpdate.push(`email=$${count++}`);
        values.push(payload.email);
    }

    if(payload.phone !== undefined){
        fieldToUpdate.push(`phone=$${count++}`);
        values.push(payload.phone);
    }

    if(payload.password !== undefined){
        const hashedPass = await bcrypt.hash(payload.password as string, 10)
        fieldToUpdate.push(`password=$${count++}`);
        values.push(hashedPass);
    }

    if(payload.role !== undefined){
        fieldToUpdate.push(`role=$${count++}`);
        values.push(payload.role);
    }

    
    if(fieldToUpdate.length === 0){
        throw new Error('Nothing to update');
    }
    values.push(id);
    return await pool.query(`UPDATE users SET ${fieldToUpdate.join(', ')} WHERE id=$${count} RETURNING *`, values);
}


const deleteUser = async(id: string) => {
    return await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
}

const userServices = {
    getAllUsers, 
    getUser,
    updateUser,
    deleteUser
}


export default userServices;