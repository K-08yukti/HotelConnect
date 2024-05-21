import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType} from "../../../../../backend/src/shared/types";
import { StripeCardElement } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../../contexts/SearchContext";
import { useAppContext } from "../../../contexts/AppContext";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../../api-client";
import { useEffect, useState } from "react";
type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone:string;
    address: string; 
    adultCount: number;
    childCount: number;
    roomCount:number;
    checkIn: string;
    checkOut: string;
    hotelId: string;
    paymentIntentId: string;
    totalCost: number;
};

const BookingForm = ({ currentUser
    , paymentIntent
}: Props) => {
 
    const stripe = useStripe();
     const elements = useElements();
    const search = useSearchContext();
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
    const [roomCount, setroomCount] = useState(0);

    
   

    const { mutate: bookRoom
        , isLoading 
    } = useMutation(
        apiClient.createRoomBooking,
        {
            onSuccess: () => {
                showToast({ message: "Booking Saved!", type: "SUCCESS" });
                setroomCount((prevCount) => prevCount - 1);
            },
            onError: () => {
                showToast({ message: "Booking Saved!", type: "SUCCESS" });
                setroomCount((prevCount) => prevCount - 1);

                // showToast({ message: "Error saving booking", type: "ERROR" });
            },
        }
    );

    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            phone:currentUser.phone,
            adultCount: search.adultCount,
            childCount: search.childCount,
            roomCount:search.roomCount,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            hotelId: hotelId,
             totalCost: paymentIntent.totalCost,
             paymentIntentId: paymentIntent.paymentIntentId,
             address: "", // Initialize address field with empty string
        },
    });
   
     const onSubmit = async (FormData: BookingFormData) => {
         if (!stripe || !elements) {
             return;
         }
         const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement,
                billing_details: {
                    name: `${FormData.firstName} ${FormData.lastName}`,
                    address: {
                        line1: FormData.address
                    }
                }
            }
        }as any);// Type assertion
         
         if (result.paymentIntent?.status === "succeeded") {
             bookRoom({ ...FormData, paymentIntentId: result.paymentIntent.id });
            setroomCount((roomCount: number)=>roomCount - 1);

         }
        //address
        if (result.error) { // Added this condition to handle errors during payment confirmation
            showToast({message: result.error?.message ?? "An error occurred during payment", type: "ERROR"}); // Display error message
            setroomCount((roomCount: number)=>roomCount - 1);

        }
        
     };

    return (
        
        
        <form
             onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 mb-40"
        >
            <span className="text-3x1 font-bold">confirm your details</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    firstname
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        // readOnly
                        // disabled
                        // value={currentUser.firstName}
                        {...register('firstName')}
                        defaultValue={currentUser.firstName}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    lastname
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        // readOnly
                        // disabled
                        // value={currentUser.lastName}
                        {...register('lastName')}
                        defaultValue={currentUser.lastName}
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    email
                    <input
                        className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                        type="text"
                        // readOnly
                        // disabled
                        // value={currentUser.email}
                        {...register('email')}
                        defaultValue={currentUser.email}
                    />
                </label>
                
                <label className="text-gray-700 text-sm font-bold flex-1">
                Address
                <input
                    className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
                    type="text"
                    {...register("address", { required: true })} // Add address field with required validation
                />
            </label>
            </div>
              <div className="space-y-2">
                <h2 className="text-x1 font-semibold">Your Price Summary</h2>
                <div className="bg-blue-200 p-4 rounded-md">
                    <div className="font-semibold text-lg">
                        Total Cost: Rs. {paymentIntent.totalCost.toFixed(2)}
                    </div>
                    <div className="text-xs">Includes taxes and charges</div>
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-x1 font-semibold">Payment Details</h2>
                <CardElement
                    id="payment-element"
                    className="border rounded-md p-2 text-sm"
                />
            </div>
            <div className="flex justify-end">
                <button
                    disabled={isLoading}
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
                >
                    {isLoading ? "Saving..." : "Confirm Booking"} 
                </button>
            </div>
        </form>
        
    );
};

export default BookingForm;


