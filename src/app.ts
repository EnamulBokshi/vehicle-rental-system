import express from 'express';
import config from './config';
import authRoute from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicle.routes';
import initDB from './config/db';
import userRoutes from './modules/users/user.routes';
import bookingRoutes from './modules/bookings/booking.routers';


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
initDB();


app.get("/health-check", (request, response)=>{
    response.status(200).json({success: true, message: 'Cool server is up and running!!'});
})

app.use("/api/v1/auth",authRoute);

app.use("/api/v1/vehicles", vehicleRoutes)

app.use("/api/v1/users",userRoutes);

app.use("/api/v1/bookings", bookingRoutes);

export default app;

