import { errorResponseType } from "../types/response.type";

type errorReturnType = (message: string, errors: string) => errorResponseType
const errorResponse:errorReturnType = (message, errors)=>{
    return {success: false, message, errors}
}

export default errorResponse;