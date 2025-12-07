import { pool } from "../../config/db";


const createBooking = async(payload: Record<string, unknown>) => {
    const {customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status}  = payload;
    
    await pool.query(`
        UPDATE vehicles SET availability_status = 'booked' WHERE id = $1
        `,[vehicle_id]);
    return await pool.query(` 
            INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
        `,[customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

}

const getBooking = async(customerId: string) => {
    return await pool.query(`SELECT * FROM bookings WHERE customer_id = $1 RETURNING *`,[customerId]);
}

const getBookingByVehicleId = async(vehicle_id: string) => {
    return await pool.query(`SELECT * FROM bookings WHERE vehicle_id = $1 RETURNING *`,[vehicle_id]);
}


const getAllBookings = async() =>{
    return await pool.query(`SELECT * FROM bookings`);
}



const changeStatus = async(id:string, status: 'cancelled' | 'returned') =>{
    const result = await pool.query(`
            UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *
        `,[status, id]);
    
    const vehicleId = result.rows[0].vehicle_id;
    await pool.query(`
            UPDATE vehicles SET availability_status = $1 WHERE id =$2
        `,['available',vehicleId]);

    return result;
}

// const createBooking = async(payload: Record<string, unknown>) => {
//     const {customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status}  = payload;
    
//     const client = await pool.connect();
//     try {

//         await client.query('BEGIN');

//         const booking = await client.query(` 
//             INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
//         `,[customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

//         await client.query(`
//             UPDATE vehicles SET availability_status = 'booked' WHERE id = $1
//             `, [vehicle_id]);
        
//         await client.query('COMMIT');

//         return booking;

//     } catch (err: any) {
//         await client.query('COMMIT');
//     }
//     finally{
//         client.release();
//     }
    
// }



const bookingServices = {
    createBooking,
    getBooking,
    getAllBookings,
    changeStatus,
    getBookingByVehicleId
}

export default bookingServices;