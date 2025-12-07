import { TUser } from "./../../types/commonTypes";
import errorResponse from "../../helpers/errorMessage";
import { TVehicle } from "../../types/commonTypes";
import userServices from "../users/user.services";
import vehicleServices from "../vehicles/vehicle.services";
import bookingServices from "./booking.services";
import { Request, Response } from "express";

const createBooking = async (req: Request, res: Response) => {
	try {
		const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
			req.body;

		if (!customer_id && !vehicle_id && !rent_end_date && !rent_start_date) {
			res
				.status(400)
				.json(
					errorResponse(
						"One or more required files is missing",
						"Validation failed",
					),
				);
			return;
		}

		const vehicle: TVehicle | undefined = (
			await vehicleServices.getVehicle(vehicle_id)
		).rows[0];
		console.log("Vehicle: ", vehicle);
		if (!vehicle) {
			res
				.status(404)
				.json({
					success: false,
					message: "Vehicle booking failed",
					error: "No vehicle found on the given id",
				});
			return;
		}

		if (vehicle.availability_status === "booked") {
			res
				.status(400)
				.json({
					success: false,
					message: "Vehicle booking failed",
					error: "Vehicle is not available",
				});
			return;
		}

		const user: TUser | undefined = (await userServices.getUser(customer_id))
			.rows[0];

		if (!user) {
			res
				.status(404)
				.json({
					success: false,
					message: "Vehicle booking failed",
					error: "No users found on the given id",
				});
			return;
		}

		const startDate = new Date(rent_start_date);
		const endDate = new Date(rent_end_date);
		if (endDate <= startDate) {
			res
				.status(400)
				.json({
					success: false,
					message: "Booking failed",
					error: "End date is must has to be greater than the start date",
				});
			return;
		}

		const days = Math.ceil(
			(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		const price = days * vehicle.daily_rent_price;
		console.log("Booking Data: ", {
			customer: user.name,
			vehicle: vehicle.vehicle_name,
			days,
			total_price: price,
		});

		const result = (
			await bookingServices.createBooking({
				customer_id,
				vehicle_id,
				rent_start_date,
				rent_end_date,
				total_price: price,
				status: "active",
			})
		).rows[0];

		if (!result) {
			res
				.status(500)
				.json({
					success: false,
					message: "Vehicle bookings failed",
					error: "Internal server error",
				});
			return;
		}

		const bookingData = {
			...result,
			rent_start_date,
			rent_end_date,
			vehicle: {
				vehicle_name: vehicle.vehicle_name,
				daily_rent_price: vehicle.daily_rent_price,
			},
		};

		res.status(201).json({ message: "Booking checking: ", data: bookingData });
	} catch (err: any) {
		console.log("Bookings errors: ", err);
	}
};

const getBookings = async (req: Request, res: Response) => {
	try {
		const user = req.user;

		if (user?.role === "admin") {
			// const customer:TUser | undefined = (await userServices.getUser(user.id)).rows[0];

			// if(!customer) {
			//     res.status(404).json({
			//     success: false,
			//     message: 'User not found',
			//     error: 'You are not authorized to view bookings or maybe you does not exists'
			// });
			// }

			const bookings = (await bookingServices.getAllBookings()).rows;
			if (!bookings) {
				res
					.status(200)
					.json({ success: true, message: "No bookings data found" });
			}
			const formattedBookings = await Promise.all(
				bookings.map(async (currentBooking) => {
					const userId = currentBooking.customer_id;
					const vehicleId = currentBooking.vehicle_id;
					const vehicle = (await vehicleServices.getVehicle(vehicleId)).rows[0];
					const customer = (await userServices.getUser(userId)).rows[0];
                    console.log('Customer: ', customer);
					const newBooking = {
						...currentBooking,
						customer: { name: customer.name, email: customer.email },
						vehicle: {
							vehicle_name: vehicle.vehicle_name,
							registration_number: vehicle.registration_number,
						},
					};

					return newBooking;
				}),
			);

			console.log("Booking data (admin view): ", formattedBookings);

			res
				.status(200)
				.json({
					success: true,
					message: "Bookings retrieved successfully",
					data: formattedBookings,
				});

			// res.status(200).json({success: true, message: 'Bookings retrieved successfully', data: bookings})
		} else if (user?.role === "customer") {
			const bookings = (await bookingServices.getBooking(user.id)).rows;

			if (!bookings) {
				res
					.status(200)
					.json({ success: true, message: "No bookings data found" });
			}

			// const formattedBooking = await bookings.reduce(async (prevBooking, currentBooking) => {
			//     const vehicleId = currentBooking.vehicle_id;
			//     currentBooking['vehicle'] = {};
			//     const vehicle = (await vehicleServices.getVehicle(vehicleId)).rows[0];
			//     currentBooking['vehicle'] = {vehicle_name:vehicle.vehicle_name, registration_number:vehicle.registration_number, type: vehicle.type};

			//     return prevBooking.push(currentBooking);
			// }, [])
			const formattedBooking = await Promise.all(
				bookings.map(async (currentBooking) => {
					const vehicleId = currentBooking.vehicle_id;
					const vehicle = (await vehicleServices.getVehicle(vehicleId)).rows[0];
					const newBooking = {
						...currentBooking,
						vehicle: {
							vehicle_name: vehicle.vehicle_name,
							registration_number: vehicle.registration_number,
							type: vehicle.type,
						},
					};
					delete newBooking.customer_id;
					return newBooking;
				}),
			);
			// console.log('Formatted vehicle: ',formattedBooking)
			res
				.status(200)
				.json({
					success: true,
					message: "Bookings retrieved successfully",
					data: formattedBooking,
				});
		} else {
			res.status(403).json({
				success: false,
				message: "Unauthorized access",
				error: "You are not authorized to view bookings",
			});
		}
	} catch (err: any) {
		console.log("Bookings retrieval error: ", err.message);
		res
			.status(500)
			.json({
				success: false,
				message: "Failed to retrieved bookings data!",
				error: err.message,
			});
	}
};

const updateBookingStatus = async(req: Request, res: Response) => {
    try {
        const {bookingId} = req.params;
        const {status} = req.body;
    
        if(!bookingId && !status){
            res.status(400).json({success:false, message: 'status is missing'});
            return;
        }

        const userRole = req.user?.role || undefined;
        if(!userRole) {
            res.status(401).json({success:false, message: 'access denied'});
            return;
        }
        
        if(userRole === 'admin' && status === 'returned'){
            const result = (await bookingServices.changeStatus(bookingId !, status)).rows[0];
            if(!result){
                res.status(500).json({success: false, message: 'Failed to update status'})
                
                return;
            }
            const vehicleId = result.vehicle_id;
            const vehicle = (await vehicleServices.getVehicle(vehicleId)).rows[0];
            const formattedData = {...result, vehicle:{availability_status: vehicle.availability_status}};
            res.status(200).json({success: true, message: "Booking cancelled successfully", data: formattedData}) 

            return;
        }
        else if(userRole === 'customer' && status === 'cancelled'){
            const result = (await bookingServices.changeStatus(bookingId !, status)).rows[0];
            
            if(!result){
                res.status(500).json({success: false, message: 'Failed to update status'})
                
                return;
            }

            res.status(200).json({success: true, message: "Booking marked as returned. Vehicle is now available", data: result}) 
            return;
        }
        else{
            res.status(403).json({
				success: false,
				message: "Unauthorized access",
				error: "You are not authorized to view bookings",
			});
        }

    } catch (err: any) {
        console.log("Update booking status error: ",err);
        res.status(500).json(errorResponse(err.message, err));
    }
}

const bookingController = {
	createBooking,
	getBookings,
    updateBookingStatus
};

export default bookingController;
