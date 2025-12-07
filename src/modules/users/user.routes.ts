import authMiddleware from "../../middlewares/auth.middleware";
import userControllers from "./user.controller";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get('/', authMiddleware('admin'),userControllers.getAllUsers);
userRoutes.put("/:userId", authMiddleware('admin','customer'), userControllers.updateUser);
userRoutes.delete("/:userId", authMiddleware('admin'), userControllers.deleteUser);


export default userRoutes;