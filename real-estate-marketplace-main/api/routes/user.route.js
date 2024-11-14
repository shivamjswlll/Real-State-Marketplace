import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  signOut,
  getUserListings,
  getUser,
} from "../controller/user.controller.js";
import verifyUser from "../utils/verifyUser.js";

const route = express.Router();

route.get("/test", test);

route.post("/update/:id", verifyUser, updateUser);
route.delete('/delete/:id', verifyUser, deleteUser);
route.post('/signout/:id', verifyUser, signOut);
route.get('/listings/:id', verifyUser, getUserListings);
route.get('/:id', verifyUser, getUser);

export default route;
