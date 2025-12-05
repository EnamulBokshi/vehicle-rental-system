import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';

declare global{
    namespace Express{
        interface Request{
            user?: JwtPayload
        }
    }
}