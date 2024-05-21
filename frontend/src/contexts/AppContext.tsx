import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { Stripe, loadStripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || ""

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
  };

  type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn:boolean;
    userRole: string; // Add userRole to the AppContext
    stripePromise: Promise<Stripe | null>;
  };
  const AppContext = React.createContext<AppContext | undefined>(undefined);

  const stripePromise =loadStripe(STRIPE_PUB_KEY);

  export const AppContextProvider = ({
children,
  }: {children:React.ReactNode;
})=>{
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const {isError,data}= useQuery("validateToken",apiClient.validateToken,{
        retry:false,
    });

    // Extract userRole from the data if available, otherwise default to "user"
    const userRole = data && data.user ? data.user.role : "user";
    
      

    return(
        <AppContext.Provider value={{
            showToast:(toastMessage) => {
                setToast(toastMessage);
            },
            isLoggedIn: !isError,
            userRole: userRole, // Include userRole in the context value
            stripePromise
        }}
        >
            {toast && (
            <Toast 
            message={toast.message} 
            type={toast.type}
            onClose={()=>setToast(undefined)}
            />
            )}
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}
