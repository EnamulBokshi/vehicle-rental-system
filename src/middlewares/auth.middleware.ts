
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import errorResponse from '../helpers/errorMessage';
import config from '../config';
const authMiddleware = (...roles:string[]) =>{
    return async (req: Request,res:Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            console.log("token: ", token);

            if(!token){
                return res.status(401).json(errorResponse('Access token in missing!','Missing or invalid authentication token'));
            }
            const jwtToken = token.substring(7);
            console.log("jwt token: ",jwtToken);
            const decodedData = jwt.verify(jwtToken, config.jwtSecret as string) as JwtPayload;
            req.user = decodedData;
            if(roles.length && !roles.includes(decodedData.role)){
                return res.status(401).json(errorResponse('Access denied!', 'Unauthorized access!'))
            }
            next();
        } catch (err: any) {
            console.log("auth error: ", err.message);
            res.status(500).json(errorResponse('Somethings went wrong', err.message));
        }
    }
}

export default authMiddleware;