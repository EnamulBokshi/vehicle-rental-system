import { successResponseType } from "../types/response.type";

type successReturnType = (message: string, data: []|{}) => successResponseType
const successResponse:successReturnType = (message, data)=>{
    return {success: true, message, data};
}
export default successResponse;