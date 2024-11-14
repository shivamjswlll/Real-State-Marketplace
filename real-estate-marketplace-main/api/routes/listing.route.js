import express from 'express';
import verifyUser from '../utils/verifyUser.js';
import {
  createListing,
  deleteListing,
  updateUserListing,
  getListingData,
  getListings,
} from "../controller/listing.controller.js";

const router = express.Router();

router.post("/create", verifyUser, createListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.post("/update/:id", verifyUser, updateUserListing);
router.get("/get/:id", getListingData);
router.get("/get", getListings);

export default router;
