import React, {useContext, useState } from "react";

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  roomCount:number;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    roomCount:number,
  ) => void;
  setroomCount: React.Dispatch<React.SetStateAction<number>>; 
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    ()=>sessionStorage.getItem("destination") || "");
  const [checkIn, setCheckIn] = useState<Date>(
    ()=>
  new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()));

  const [checkOut, setCheckOut] = useState<Date>(
    ()=>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()));
  
  const [adultCount, setAdultCount] = useState<number>(()=>
  parseInt(sessionStorage.getItem("adultcount") || "1"));
  const [childCount, setChildCount] = useState<number>(()=>
  parseInt(sessionStorage.getItem("childcount") || "0"));
  const [roomCount, setroomCount] = useState<number>(()=>
    parseInt(sessionStorage.getItem("roomcount") || "1"));
   
  const [hotelId, setHotelId] = useState<string>(()=>
  sessionStorage.getItem("hotelId")||"");

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    roomCount:number,
    hotelId?: string,
) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    setroomCount(roomCount);
    if (hotelId) {
      setHotelId(hotelId);
    }
 
    sessionStorage.setItem("destination",destination);
    sessionStorage.setItem("checkIn",checkIn.toISOString());
    sessionStorage.setItem("checkOut",checkOut.toISOString());
    sessionStorage.setItem("adultCount",adultCount.toString());
    sessionStorage.setItem("childCount",childCount.toString());
    sessionStorage.setItem("roomCount",roomCount.toString());

    if (hotelId){
        sessionStorage.setItem("hotelId",hotelId);
    }
};

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        hotelId,
        roomCount,
        setroomCount,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext;
};