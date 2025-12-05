import { Router } from "express";
import vehicleController from './vehicle.controllers'
import authMiddleware from "../../middlewares/auth.middleware";
import vehicleServices from "./vehicle.controllers";
const vehicleRoutes = Router();


vehicleRoutes.post("/", authMiddleware('admin'),vehicleController.createVehicle);
vehicleRoutes.get("/", vehicleController.getAllVehicles);


export default vehicleRoutes;