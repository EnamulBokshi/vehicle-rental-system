import cron from 'node-cron';
import { pool } from '../config/db';

const updateExpiredBookings = async () => {
    try {        
        const result = await pool.query(`
            UPDATE bookings 
            SET status = 'returned' 
            WHERE rent_end_date < CURRENT_DATE 
            AND status = 'active'
            RETURNING vehicle_id
        `);

        if (result.rows.length > 0) {
            const vehicleIds = result.rows.map(row => row.vehicle_id);

            await pool.query(`
                UPDATE vehicles 
                SET availability_status = 'available' 
                WHERE id = ANY($1::int[])
            `, [vehicleIds]);
        } else {
            console.log('No expired bookings found');
        }
    } catch (error: any) {
        console.error('Error updating expired bookings:', error.message);
    }
};

// Run every day at midnight
export const startBookingScheduler = () => {
    cron.schedule('0 0 * * *', updateExpiredBookings);
};

export default startBookingScheduler;