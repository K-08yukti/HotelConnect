import {useQuery} from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/ManageHotelForm/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { useAppContext } from "../contexts/AppContext";
import { Elements } from "@stripe/react-stripe-js";

const Booking:React.FC =()=>{
    const {stripePromise}= useAppContext();
    const search =useSearchContext();
    const [numberOfNights, setNumberOfNights]= useState<number>(0);
    const {hotelId}=useParams<{ hotelId: string }>();
    console.log("hotel",hotelId);
    const {data:hotel }=useQuery("fetchHotelById",()=>
        apiClient.fetchHotelById(hotelId || "")
        ,{
            enabled: !!hotelId,
        }
    );
    
console.log("hotelid from booking:",hotelId);
   
    useEffect(()=>{
        
       
        if(search.checkIn && search.checkOut){
            const nights = Math.abs(search.checkOut.getTime()-search.checkIn.getTime()) /
            (1000 * 60 * 60 * 24);

            setNumberOfNights(Math.ceil(nights))
        }
    },[search.checkIn ,search.checkOut]);
    
//payment
    const {data:paymentIntentData}= useQuery(
        "createPaymentIntent",
        ()=>
        apiClient.createPaymentIntent(
            hotelId || "",
            numberOfNights.toString()
        ),
        {
            enabled: !!hotelId && numberOfNights>0, 
        }
    );
        
   
    

    const { data: currentUser }=useQuery(
        "fetchCurrentUser",
        apiClient.fetchCurrentUser
    );
    
    if(!hotel){
        return <></>;
    }
   
    
    console.log(currentUser?.email);
    return (
    <div className="grid md:grid-cols-[1fr_2fr]">         
        <BookingDetailSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        // roomCount={search.roomCount}
        hotel={hotel }
        />
        {currentUser && 
            paymentIntentData &&
            ( 
           <Elements
             stripe={stripePromise}
             options={{clientSecret:paymentIntentData.clientSecret,
             }} 
            >
            <BookingForm currentUser={currentUser}
            paymentIntent={paymentIntentData}
            /> 
           </Elements> 
         )
        }         
        </div>           
    );
};
export default Booking;

