import express from 'express';
import config from './config';
import authRoute from './modules/auth/auth.routers';
import vehicleRoutes from './modules/vehicles/vehicle.routers';
import initDB from './config/db';


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
initDB();


app.get("/health-check", (request, response)=>{
    response.status(200).json({success: true, message: 'Cool server is up and running!!'});
})

app.use("/api/v1/auth",authRoute);

app.use("/api/v1/vehicles", vehicleRoutes)

export default app;

