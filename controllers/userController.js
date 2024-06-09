import {
  getAllUsers,
  addNewUser,
  deleteUserById,
  getUser,
  updateUserData,
  getUserByEmail,
} from "../database/usersDB.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const tokenRefresh = async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No refresh token was presented" });
  }

  try {
    const user = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_JWT_SECRET,
      { expiresIn: process.env.ACCESS_JWT_LIFE }
    );
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh token is invalid" });
  }
};

export const verifyUser = async (req,res) => {
  console.log(req.user);
  try {
    const user = await getUser(req.user.id);
    if(!user){
      res.status(401).json({message: "No such user in database"});
    }
    res.status(200).json({data: user});

  } catch (err) {
    res.status(500).json({message: err.message})
  }
}

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
    const { id } = req.body;
    const users = await getUser(id);
    res.status(200).json(users);
  } catch (err) {
    console.error("Error getting user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const addedUser = await addNewUser({ name, email, hashedPassword, role });
    res.status(200).json({addedUser: addedUser});
  } catch (err) {
    console.error("Error adding new user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = await deleteUserById(id);
    res.status(200).json(deletedUser);
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, update } = req.body;
    const userUpdated = await updateUserData(id, update);
    res.status(200).json({ message: userUpdated });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Authentication failed. User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Authentication failed. Wrong password." });
    }

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.REFRESH_TOKEN_SECRET, // Secret key
      { expiresIn: "30d" } // Token expiration time
    );

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Payload
      process.env.ACCESS_TOKEN_SECRET, // Secret key
      { expiresIn: '18m' } // Token expiration time
    );
    

    res.status(200).json({
      message: "Authentication successful",
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
