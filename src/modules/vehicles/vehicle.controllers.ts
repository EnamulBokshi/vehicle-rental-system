import errorResponse from "../../helpers/errorMessage";
import successResponse from "../../helpers/successMessage";
import vehicleServices from "./vehicle.services";
import { Request, Response } from "express";

const createVehicle = async(req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);
        const vehicle = result.rows[0];
        const newVehicle = {id:vehicle.id, vehicle_name: vehicle.vehicle_name, type: vehicle.type, registration_number:vehicle.registration_number, daily_rent_price: vehicle.daily_rent_price, availability_status: vehicle.availability_status};

        res.status(200).json(successResponse('Vehicle created successfully',newVehicle));
    } catch (error:any) {
        console.log("Couldn't create the vehicle, please solve the error: ",error.message);

        res.status(400).json(errorResponse('Vehicle creation failed',error.message));
    }
}

const getAllVehicles = async (req: Request, res: Response) =>{
    try {
        const result = await vehicleServices.getAllVehicles();
        if(result.rows.length === 0) {
            res.status(200).json(successResponse('No vehicles found',[]))
            return;
        }
        res.status(200).json(successResponse('Vehicles retrieved successfully',result.rows));
         
    } catch (err: any) {
        console.log("Failed to get all the vehicles: ",err.message);
        res.status(400).json(errorResponse('Vehicle retrieve failed',err.message));

    }
}
const vehicleController = {
    createVehicle,
    getAllVehicles
}


export default vehicleController;