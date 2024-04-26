import express from "express";
const router = express.Router();
import { getUsers, addUser, deleteUser } from "../controllers/userController.js";

router.get("/getAll", getUsers);
router.post("/addUser", addUser);
router.delete("/delete", deleteUser);

export default router;