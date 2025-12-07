
import express, { Request, Response } from 'express';
import authRoute from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import initDB from './config/db';
import userRoutes from './modules/users/user.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import startBookingScheduler from './helpers/updateExpiredBookings';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
initDB();

startBookingScheduler();

app.get("/health-check", (request, response)=>{
    response.status(200).json({success: true, message: 'Cool server is up and running!!'});
})

app.use("/api/v1/auth",authRoute);

app.use("/api/v1/vehicles", vehicleRoutes)

app.use("/api/v1/users",userRoutes);

app.use("/api/v1/bookings", bookingRoutes);
app.use("/", (Request, Response)=>{
    Response.status(200).json({message: 'Welcome to Vehicle Rental System'});
})
app.use((req:Request, res:Response) =>{
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    })
});


export default app;

