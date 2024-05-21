import express, { Request, Response } from "express";
import Hotel from "../models/hotel";

const router = express.Router();

// /api/all-hotels-with-bookings
router.get("/", async (req: Request, res: Response) => {
  try {
    const hotelsWithBookings = await Hotel.find(
      { bookings: { $exists: true, $ne: [] } },
    );

    res.status(200).json(hotelsWithBookings);
  } catch (error) {
    console.error("Error fetching hotels with bookings:", error);
    res.status(500).json({ message: "Unable to fetch hotels with bookings" });
  }
});

export default router;
