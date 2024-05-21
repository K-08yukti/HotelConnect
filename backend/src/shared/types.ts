export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone:string;
  role: string;
};

export type HotelType = {
    _id:string;
    userId:string;
    name:string;
    city:string;
    description:string;
    type:string;
    adultCount:number;
    childCount:number;
    facilities:string[];
    pricePerNight:number;
    starRating:number;
    imageUrls:string[];
    lastUpdated:Date;
    roomCount: number;
    bookings:BookingType[];
};
//payment
export type BookingType={
  _id:string;
  userId: string;
  firstName: string;
  lastName:string;
  email:string;
  adultCount:number;
  childCount:number;
  roomCount:number;
  checkIn:Date;
  checkOut:Date;
  totalCost:number;
}

export type HotelSearchResponse = {
    data: HotelType[];
    pagination: {
      total: number;
      page: number;
      pages: number;
    };
  };
//payment
  export type PaymentIntentResponse={
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  };