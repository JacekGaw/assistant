import User from "../models/UserShema.js";

export const addNewUser = async ({ name, email, hashedPassword, role }) => {
  try {
    const user = await User.findOne({email});
    if(user){
        throw new Error("User already registered");
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const savedUser = await newUser.save();
    console.log("New user successfuly added: ", savedUser);
    return savedUser;
  } catch (err) {
    throw err;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find({});
    console.log(users);
    return users;
  } catch (err) {
    console.error("Getting all users failed: ", err);
    throw err;
  }
};

export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if(!user) {
      throw new Error("No user with provided id");
    }
    console.log(user);
    return user;
  } catch (err) {
    console.error("Getting user failed: ", err);
    throw err;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    if(!user){
      throw new Error("No user to delete");
    }
    console.log(user);
    return user;
  } catch (err) {
    console.error("Could not delete user: ", err);
    throw err;
  }
};

export const updateUserData = async (userId, update) => {
  try {
    const updatedUser = await User.findByIdAndUpdate({_id: userId}, update);
    if(!updatedUser){
      throw new Error("Could not update user. User do not exist or data is invalid");
    }
    console.log(updatedUser);
    return updatedUser;
  }
  catch (err) {
    throw err;
  }
}
