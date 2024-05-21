import mongoose, {Schema} from "mongoose";
import {  BookingType, HotelType } from "../shared/types";


const bookingSchema= new mongoose.Schema<BookingType>({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    email: {type: String, required:true},
    adultCount: {type: Number, required:true},
    childCount: {type: Number, required:true},
    roomCount:{type:Number,required:true,min:1},
    checkIn: {type: Date, required:true},
    checkOut: {type: Date, required:true},
    userId: {type: String, required:true},
    totalCost: {type: Number, required:true},
});

const hotelSchema = new Schema<HotelType>({
    userId:{type:String, required:true},
    name:{type:String, required:true},
    city:{type:String,required:true},
    description:{type:String,required:true},
    type:{type:String,required:true},
    adultCount:{type:Number,required:true},
    childCount:{type:Number,required:true},
    facilities:[{type:String,required:true}],
    pricePerNight:{type:Number,required:true},
    starRating:{type:Number,required:true,min:1,max:5},
    lastUpdated:{type:Date,required:true},
    roomCount:{type:Number,required:true,min:1},
    imageUrls: [{ type: String }],
    bookings:[bookingSchema],
});

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema);
export default Hotel;
