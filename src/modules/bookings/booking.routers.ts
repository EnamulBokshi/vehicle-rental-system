import authMiddleware from "../../middlewares/auth.middleware";
import bookingController from "./booking.controllers";
import { Router } from "express";


const bookingRoutes = Router();
bookingRoutes.post("/", authMiddleware('admin', 'customer'),bookingController.createBooking);
bookingRoutes.get("/", authMiddleware('admin','customer'), bookingController.getBookings);
bookingRoutes.put("/:bookingId", authMiddleware('admin','customer'), bookingController.updateBookingStatus);

export default bookingRoutes;