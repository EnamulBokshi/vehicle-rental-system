import { Request, Response } from "express";
import userServices from "./user.services";
import errorResponse from "../../helpers/errorMessage";
import successResponse from "../../helpers/successMessage";
import bookingServices from "../bookings/booking.services";

const getAllUsers = async(req:Request, res:Response) => {
    try {
        const result = await userServices.getAllUsers();
        if(result.rows.length === 0) {
            res.status(200).json({success: true, message: 'No users exists! ', data: []});
            return;
        }
        console.log("users: ", result.rows);
        res.status(200).json(successResponse('Users retrieved successfully',result.rows));
    } catch (err: any) {
        console.log(`Users getting error: `, err.message);

        res.status(500).json(errorResponse(`Couldn't get all users `, err.message));
    }
}

const updateUser = async(req: Request, res: Response) => {
    try {
        const payload = req.body;
        const {userId} = req.params;
        const allowedUser = req.user;
        console.log("allowed user: ",allowedUser);

        if(allowedUser?.id != userId && allowedUser?.role !=='admin') {
            return res.status(403).json(errorResponse('You are not allowed ', 'Forbidden, Unauthorized access'));
        }

        const currentUser = (await userServices.getUser(userId!)).rows[0];
        console.log("Current user: ", currentUser)
        if(!currentUser) {
            return res.status(404).json(errorResponse('User not found! ', 'Provided user id does not exists in the database'));
        }
        
        const newUser = {...currentUser, ...payload};
        console.log("New User: ", newUser)
        delete newUser.password;
        const result = await userServices.updateUser(userId as string,newUser);

        if(result.rows.length === 0) {
            return res.status(500).json({success: false, message: 'Failed to update user!',error: 'Internal server error'});
        }
        delete newUser.password;
        res.status(200).json({success: true, message: 'User updated successfully', data:newUser})
    } catch (err: any) {
        console.log("Update failed: ", err)
        res.status(500).json(errorResponse('User update failed', err.message));
    }
}

const deleteUser = async(req: Request, res: Response) => {
    try {
        const {userId} = req.params;

        
        //TODO check if  any bookings exists or not !
        const bookings = (await bookingServices.getBooking(userId!));
        let hasActiveBooking = false;

        bookings.rows.map((row) => {
            if(row.status === 'active') {
                
                hasActiveBooking = true;
                
            }
        })

        if(hasActiveBooking) {
            res.status(400).json({success: false, message: "Couldn't delete the user! Has one or more active bookings ", error: 'Failed to delete the user' });
            return 
        }
        
        const result = await userServices.deleteUser(userId!);
        
        if(result.rowCount === 0) {
            res.status(404).json({success: false, message: 'User does not exists'});
        }

    } catch (err: any) {
        console.log('User delete error: ', err)
        res.status(500).json(errorResponse('Internal Server Error', err.message));
    }
}


const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}

export default userControllers;
