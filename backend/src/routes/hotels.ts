import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import {  BookingType, HotelSearchResponse } from "../shared/types";
import {param, validationResult} from "express-validator";
const router = express.Router();
import Stripe from "stripe";
import verifyToken from "../middleware/auth";
//payment
const stripe= new Stripe(process.env.STRIPE_API_KEY as string);

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }


    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);
    

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID id required")],
  async (req:Request,res:Response)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }
    const id = req.params.id.toString(); 

    try{
      const hotel =await Hotel.findById(id);
      res.json(hotel);
    }catch(error){
      console.log(error);
      res.status(500).json({message: "Error fetching hotels"});
    }
  }
);

//payment
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  async(req:Request, res:Response)=>{

    const {numberOfNights}=req.body;
    const hotelId= req.params.hotelId;
    const hotel= await Hotel.findById(hotelId);
    if(!hotel){
      return res.status(400).json({message:"hotel not found"});
    }
    const totalCost= hotel.pricePerNight * numberOfNights;
    const paymentIntent= await stripe.paymentIntents.create({
      amount:totalCost *100,
      currency:"INR",
      metadata:{
        hotelId,
        userId: req.userId,
      },
    });
    if(!paymentIntent.client_secret){
      return res.status(500).json({message: "error cretaing payment intent"});
    }
    const response={
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };
    res.send(response);
  }
);

// router.post(
//   "/:hotelId/bookings",
//   verifyToken,
//   async(req:Request, res: Response)=>{
//     try{
//       const paymentIntentId=req.body.paymentIntentId;
//       const paymentIntent= await stripe.paymentIntents.retrieve(
//         paymentIntentId as string
//       );

//       if(!paymentIntent){
//         return res.status(400).json({mesaage:"payment intent not found"});
//       }
//       if(
//         paymentIntent.metadata.hotelId !==req.params.hotelId ||
//         paymentIntent.metadata.userId !==req.userId
//       ){
//         return res.status(400).json({message:"payment intent mismatch"});
//       }
//       if(paymentIntent.status !=="succeeded"){
//         return res.status(400).json({message:`payment intent not succeeded.Status: ${paymentIntent.status}`});
//       }
//       const newBooking: BookingType={
//         ...req.body,
//         userId:req.userId,
//       };
//       const hotel = await Hotel.findOneAndUpdate(
//         {_id: req.params.hotelId},
//         {
//           $push: {bookings: newBooking},
//         }
//       );
//       if(!hotel){
//         return res.status(400).json({message: "hotel not found"});
//       }
//       await hotel.save();
//       res.status(200).send();
//     }catch(error){
//       console.log(error);
//       res.status(500).json({message: "something went wrong"});
//     }
//   }
// );
//  router.post(
//    "/:hotelId/bookings",
//    verifyToken,
//    async (req: Request, res: Response) => {
//      try {
//        const paymentIntentId = req.body.paymentIntentId;
//        const paymentIntent = await stripe.paymentIntents.retrieve(
//          paymentIntentId as string
//        );

//        if (!paymentIntent) {
//          return res.status(400).json({ message: "payment intent not found" });
//        }
//        if (
//          paymentIntent.metadata.hotelId !== req.params.hotelId ||
//          paymentIntent.metadata.userId !== req.userId
//        ) {
//          return res.status(400).json({ message: "payment intent mismatch" });
//        }
//        if (paymentIntent.status !== "succeeded") {
//          return res.status(400).json({
//            message: `payment intent not succeeded.Status: ${paymentIntent.status}`,
//          });
//        }
//        const newBooking: BookingType = {
//          ...req.body,
//          userId: req.userId,
//        };
//        const hotel = await Hotel.findOneAndUpdate(
//          { _id: req.params.hotelId },
//          {
//            $push: { bookings: newBooking },
//          }
//        );
//        if (!hotel) {
//          return res.status(400).json({ message: "hotel not found" });
//        }
// // Check if there are available rooms
// if (hotel.roomCount <= 0) {
//   return res.status(400).json({ message: "No rooms available" });
// }

//       //  Decrement roomCount for the hotel in the database
//       await Hotel.findByIdAndUpdate(
//         req.params.hotelId,
//         { $inc: { roomCount: -newBooking.roomCount } },
//         { new: true }
//       );

//       res.status(200).send();
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "something went wrong" });
//     }
//   }
// );
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req, res) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "Payment intent not found" });
      }
      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "Payment intent mismatch" });
      }
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `Payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      // Get the hotel details
      const hotel = await Hotel.findById(req.params.hotelId);
      if (!hotel) {
        return res.status(400).json({ message: "Hotel not found" });
      }

      // Check if there are available rooms
      if (hotel.roomCount <= 0) {
        return res.status(400).json({ message: "No rooms available" });
      }

      // Reduce room count by the number of rooms booked
      hotel.roomCount -= req.body.roomCount;
      
      // Add the booking to the hotel
      hotel.bookings.push({
        ...req.body,
        userId: req.userId,
      });

      // Save the updated hotel
      await hotel.save();

      // Respond with success
      res.status(200).json({ message: "Booking saved" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);



const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }


  if (queryParams.city) {
    constructedQuery.city = new RegExp(queryParams.city, "i");
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }
  if (queryParams.roomCount) {
    constructedQuery.roomCount = {
      $gte: parseInt(queryParams.roomCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  } 

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;