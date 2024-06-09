import express from "express";
const router = express.Router();
import { verifyToken } from "../middleware/verifyToken.js";
import { tokenRefresh, verifyUser, getUsers, addUser, deleteUser, getUserById, updateUser, loginUser } from "../controllers/userController.js";

router.get("/refresh", verifyToken, tokenRefresh);
router.get("/verify", verifyToken, verifyUser);
router.post("/login", loginUser);
router.get("/getAll", getUsers);
router.get("/getUserById", getUserById);
router.post("/register", addUser);
router.delete("/delete", deleteUser);
router.patch("/updateUser", updateUser);
//TODO: Add endpoint for logging in, where using bcrypt password will be check

export default router;