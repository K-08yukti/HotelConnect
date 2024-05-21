import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import GuestInfoForm from "../forms/ManageHotelForm/GuestInfoForm/GuestInfoForm";

const Detail=()=>{
    const {hotelId}=useParams();
    console.log("hotel",hotelId);
    const {data:hotel }=useQuery("fetchHotelById",()=>
        apiClient.fetchHotelById(hotelId || "")
        ,{
            enabled: !!hotelId,
        }
    );
    
    console.log(hotelId);

    if(!hotel){
        return <>Details</>;
    }
    return (
    <div className="space-y-6">
 <div>
<span className="flex">
  {Array.from({ length: hotel.starRating }).map((_,index) => (
    <AiFillStar key={index} className="fill-yellow-400" />
  ))}
</span>
<h1 className="text-3xl font-bold">{hotel.name}</h1>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
{hotel.imageUrls.map((image:string,index:number) => (
  <div key={index} className="h-[300px]">
    <img
      src={image}
      alt={hotel.name}
      className="rounded-md w-full h-full object-cover object-center"
    />
  </div>
))}
</div>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
{hotel.facilities.map((facility:string,index:number) => (
  <div  key={index} className="border border-slate-300 rounded-sm p-3">
    {facility}
  </div>
))}
</div>

<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
<div className="whitespace-pre-line">{hotel.description}</div>
<div className="h-fit">
 
<GuestInfoForm pricePerNight={hotel.pricePerNight} hotelId={hotel._id}/>

</div>
</div>
</div>
);
}; 

export default Detail;

