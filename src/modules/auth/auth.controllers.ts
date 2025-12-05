import errorResponse from '../../helpers/errorMessage';
import successResponse from '../../helpers/successMessage';
import authServices from './auth.services'
import { Request, Response } from 'express'
const signUp = async (req: Request, res: Response) =>{
    try {
        const result = await authServices.signUP(req.body);
        const user = result.rows[0];
        const newUser = {id: user.id, name: user.name, email: user.email, phone: user.phone, role:user.role};
        res.status(201).json(successResponse('User registered successfully', newUser));


    } catch (err: any) {
        res.status(400).json({success:false,message: "Signup validation failed! please read the error message and try with valid constraints!", errors: err.message});
        console.log(err.message)
    }
}


const login = async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        const result = await authServices.login(email, password);
        const response = {token: result?.token, user: result?.userToBeReturned}
        res.status(200).json(successResponse('Login successful', response));
    } catch (err: any) {
        res.status(400).json({success:false,message: "Login failed!!", errors: err.message});
        console.log(err.message)
    }
}

const authController = {
    signUp,
    login

}

export default authController;