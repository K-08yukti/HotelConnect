import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {HotelType, PaymentIntentResponse, UserType} from "../../backend/src/shared/types"
import { HotelSearchResponse } from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/ManageHotelForm/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const fetchCurrentUser= async ():Promise<UserType>=>{
  const response=await fetch(`${API_BASE_URL}/api/users/me`,{
    credentials:"include",
  });
  if(!response.ok){
    throw new Error("error fetching user");
  }
  return response.json();
};

export const register = async (formData:RegisterFormData) => {
    console.log("API_BASE_URL:", API_BASE_URL);
    const response = await fetch (`${API_BASE_URL}/api/users/register`,{
        method: "POST",
        credentials:"include",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(formData),
    });

    const responseBody = await response.json();

    if (!response.ok){
        throw new Error(responseBody.message);
    }
   
};

export const signIn = async (formData: SignInFormData) => {
  try{   
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const body = await response.json();
   
    if(!response.ok){
        throw new Error(body.message)
    }
    return body;
}catch (error) {
    console.error("Error during sign-in:", error);
    throw new Error("Failed to sign in");
  }
};

export const validateToken = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include",
        });

        console.log('Response Status:', response.status);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (jsonError) {
                console.error('Error parsing JSON from server:', jsonError);
            }

            const errorMessage = errorData ? errorData.message : 'Unknown error';
            console.error('Server Error:', errorData);
            throw new Error(`Token invalid. Server message: ${errorMessage}`);
        }

        return response.json();
    } catch (error:any) {
        console.error('Error during token validation:', error.message);
        throw error;
    }
};

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    roomCount?:string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
  };
  
  export const searchHotels = async (
    searchParams: SearchParams
  ): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    // queryParams.append("roomCount", searchParams.roomCount || "");don't uncooment it,it will create booking error
    
    queryParams.append("page", searchParams.page || "");
  
    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");
  
    searchParams.facilities?.forEach((facility) =>
      queryParams.append("facilities", facility)
    );
  
    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));
  
    const response = await fetch(
      `${API_BASE_URL}/api/hotels/search?${queryParams}`
    );
  
    if (!response.ok) {
      throw new Error("Error fetching hotels");
    }
  
    return response.json();
  };
export const signOut = async ()=>{
    const  response = await fetch (`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    });

    if(!response.ok){
        throw new Error("Error during sign out");
    } 
    try {
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
            const userData = await response.json();
            return userData;
        } else {
            return { message: "Sign-out successful." };
        }
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Unexpected response format during sign-out");
    }
   
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      method: "POST",
      credentials: "include",
      body: hotelFormData,
    });
    if (!response.ok) {
        throw new Error("Failed to add hotel");
      }
    
      return response.json();
    };

export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    });

    if(!response.ok){
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {

  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      body: hotelFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update Hotel");
  }

  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};


export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }
  console.log("hotelid from fetchHotelById:",hotelId);


  return response.json();
};
  
//payment
export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  // "65edb8b006b4561a64f13727"; // Replace this with the actual hotelId

  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,

    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfNights }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};



   export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await fetch(
       `${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
//indian visa test card      4000 0035 6000 0008


       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify(formData),
       }
     );
  
     if (!response.ok) {
       throw new Error("Error booking room");
     }
   };

   export const fetchMyBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }
  
    return response.json();
  };
  
  export const fetchallBookings = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/all-bookings`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }
  
    return response.json();
  };
  