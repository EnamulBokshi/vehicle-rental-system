import { pool } from "../../config/db";


const createVehicle = async(payload:Record<string, unknown>) =>{
    const {vehicle_name,type, registration_number, daily_rent_price, availability_status} = payload;
    // console.log("vehicle-payload: ",payload);
    console.log("Received data: ",{vehicle_name, registration_number, daily_rent_price, availability_status})
    if(vehicle_name == undefined || type == undefined || registration_number == undefined || daily_rent_price == undefined ||availability_status == undefined){
        throw new Error('One or more properties of vehicle is missing');
    }

    return await pool.query(`
            INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1,$2,$3,$4,$5) RETURNING *
        `,[vehicle_name, type, registration_number, daily_rent_price, availability_status])
}



const getAllVehicles = async() => {
    return await pool.query(`
        SELECT * FROM vehicles        
        `);
}

const getVehicle = async(id: string) => {
    return await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `,[id])
}

const updateVehicle = async(payload: Record<string, unknown>) => {
    
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;
    return await pool.query(

        `
        UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 RETURNING *
        `,[vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

}

const vehicleServices = {
    createVehicle,
    getAllVehicles,
    getVehicle,
    updateVehicle,
}


export default vehicleServices;