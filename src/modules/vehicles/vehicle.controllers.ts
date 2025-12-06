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
        res.status(500).json(errorResponse('Vehicle creation failed',error.message));
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
        res.status(500).json(errorResponse('Vehicles retrieve failed',err.message));

    }
}

const getVehicle = async(req: Request, res: Response) =>{
    try {
        const {vehicleId} = req.params;
        const result = await vehicleServices.getVehicle(vehicleId as string);
        if(result.rows.length === 0) {
            res.status(200).json(successResponse('No vehicle found',[]))
            return;
        }
        const vehicle = result.rows[0];
        const resVehicle = {id: vehicle.id, vehicle_name: vehicle.vehicle_name, type: vehicle.type, registration_number: vehicle.registration_number, daily_rent_price: vehicle.daily_rent_price, availability_status: vehicle.availability_status};
        res.status(200).json(successResponse('Vehicle retrieved successfully',resVehicle));


    } catch (err: any) {
        console.log("Getting vehicle got failed! ", err.message);
        res.status(500).json(errorResponse('Vehicle retrieve failed',err.message));

    }
}


const updateVehicle = async(req:Request, res: Response) => {
    try {
        const {vehicleId} = req.params;
        // const {vehicle_name,type,registration_number, daily_rent_price, availability_status} = req.body;
        const vehicleBody = req.body;

        if(!vehicleId) {
            res.status(400).json('Vehicle is required')
        }
        const vehicle = (await vehicleServices.getVehicle(vehicleId!)).rows[0];
        if(!vehicle) {
            res.status(404).json(errorResponse('The vehicle does not exists!', 'Provide the correct vehicle id'));
            return;
        }
        
        const newVehicle = {...vehicle, ...vehicleBody}
        
        const result = await vehicleServices.updateVehicle(newVehicle);
        if(result.rows.length === 0) {
            res.status(500).json(errorResponse('Update failed','Internal server error'))
            return;
        }
        res.status(200).json(successResponse('Vehicle updated successfully',result.rows[0]));
    } catch (err: any) {
        console.log('Couldn\'t update user, error: ', err.message);
        res.status(500).json(errorResponse(`Couldn't update the vehicle`,err.message));
    }
}


const deleteVehicle = async(req: Request, res: Response) => {
    try {
        const {vehicleId} = req.params;
        if(!vehicleId) {
        res.status(400).json(errorResponse(`Couldn't delete the vehicle`,'Vehicle id is required'));
            return;
        }
        const result = await vehicleServices.deleteVehicle(vehicleId);
        if(result.rowCount == 0) {
            res.status(404).json(errorResponse(`Couldn't delete the vehicle`,'Vehicle not found!'));
            return;
        }
        res.status(500).json({success: true, message: 'Vehicle deleted successfully'});
        
    } catch (err: any) {
        res.status(500).json(errorResponse(`Couldn't delete the vehicle`,err.message));
    }
}

const vehicleController = {
    createVehicle,
    getAllVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
}


export default vehicleController;