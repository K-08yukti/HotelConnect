import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext() ;


  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
  const [childCount, setChildCount] = useState<number>(search.childCount);
  const [roomCount, setroomCount] = useState<number>(search.roomCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount,
      roomCount
    );
    navigate("/search");
  };

  const clearForm = () => {
    // Reset all state values to their initial state
    setDestination("");
    setCheckIn(new Date());
    setCheckOut(new Date());
    setAdultCount(1);
    setChildCount(0);
    setroomCount(1);
  };
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  

  return (
    <form
      onSubmit={handleSubmit}
      className="-mt-8 p-2 bg-orange-400 rounded shadow-md flex flex-col lg:flex-row items-center gap-2"
      // className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
         <MdTravelExplore size={25} className="mr-2" />
         <input
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>
      <div className="flex bg-white px-1 py-1 gap-2">
         <label className="items-center flex">
           Adults:
           <input
             className="w-full p-1 focus:outline-none font-bold"
             type="number"
             min={1}
             max={20}
             value={adultCount}
             onChange={(event) => setAdultCount(parseInt(event.target.value))}
           />
         </label>
         <label className="items-center flex"> 
           Children:
           <input
            className="w-full p-1 focus:outline-none font-bold" 
            type="number"
            min={0}
            max={20}
            value={childCount}
            onChange={(event) => setChildCount(parseInt(event.target.value))}
           /> 
         </label>
      </div>
      <div className="flex bg-white p-1 gap-2">
      <label className="items-center flex style={{ width: '100px' }}">
           Rooms:
           <input
             className="w-full p-1 focus:outline-none font-bold"
             type="number"
             min={1}
             max={10}
             value={roomCount}
             onChange={(event) => setroomCount(parseInt(event.target.value))}
           />
         </label>
      </div>
       <div>
         <DatePicker
           selected={checkIn}
           onChange={(date) => setCheckIn(date as Date)}
           selectsStart
           startDate={checkIn}
           endDate={checkOut}
           minDate={minDate}
           maxDate={maxDate}
           placeholderText="Check-in Date"
           className="min-w-full bg-white p-2 focus:outline-none"
           wrapperClassName="min-w-full"
         />
       </div>
       <div>
         <DatePicker
           selected={checkOut}
           onChange={(date) => setCheckOut(date as Date)}
           selectsStart
           startDate={checkIn}
           endDate={checkOut}
           minDate={minDate}
           maxDate={maxDate}
           placeholderText="Check-in Date"
           className="min-w-full bg-white p-2 focus:outline-none"
           wrapperClassName="min-w-full"
         />
       </div>
       <div className="flex gap-1">
        <button
          type="submit"
          className="w-1/2 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
        >
          Search
        </button>
         <button
          type="button" // Use type="button" to prevent form submission
          onClick={clearForm} // Call the clearForm function on click
          className="w-1/2 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500 "
        >
          Clear
        </button>
       </div>
    </form>
  );
};

export default SearchBar;