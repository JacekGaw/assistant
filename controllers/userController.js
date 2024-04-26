import { getAllUsers, addNewUser, deleteUserById, getUser } from "../database/usersDB.js";

export const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Could not get users" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const {id} = req.body;
        const users = await getUser(id);
        res.status(200).json(users);
    } catch (err) {
        console.error("Error getting user:", err.message);
        res.status(500).json({ message: err.message });
    }
};

export const addUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        const addedUser = await addNewUser({name, email, password, role});
        res.status(200).json(addedUser);
    } catch (err) {
        console.error("Error adding new user:", err.message);
        res.status(500).json({ message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const {id} = req.body;
        const deletedUser = await deleteUserById(id);
        res.status(200).json(deletedUser);
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Error deleting user" });
    }
};