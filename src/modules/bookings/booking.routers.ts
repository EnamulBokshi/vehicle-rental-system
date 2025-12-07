import authMiddleware from "../../middlewares/auth.middleware";
import bookingController from "./booking.controllers";
import { Router } from "express";


const bookingRoutes = Router();
bookingRoutes.post("/", authMiddleware('admin', 'customer'),bookingController.createBooking);
bookingRoutes.get("/", authMiddleware('admin','customer'), bookingController.getBookings);

export default bookingRoutes;