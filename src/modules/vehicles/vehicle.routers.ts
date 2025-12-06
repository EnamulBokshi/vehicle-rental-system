import { Router } from "express";
import vehicleController from './vehicle.controllers'
import authMiddleware from "../../middlewares/auth.middleware";
import vehicleServices from "./vehicle.controllers";
const vehicleRoutes = Router();


vehicleRoutes.post("/", authMiddleware('admin'),vehicleController.createVehicle);
vehicleRoutes.get("/", vehicleController.getAllVehicles);
vehicleRoutes.get("/:vehicleId", vehicleController.getVehicle);
vehicleRoutes.put("/:vehicleId",vehicleController.updateVehicle)

export default vehicleRoutes;