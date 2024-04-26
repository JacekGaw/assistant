import express from "express";
const router = express.Router();
import { getUsers, addUser, deleteUser, getUserById } from "../controllers/userController.js";

router.get("/getAll", getUsers);
router.get("/getUserById", getUserById);
router.post("/addUser", addUser);
router.delete("/delete", deleteUser);

export default router;