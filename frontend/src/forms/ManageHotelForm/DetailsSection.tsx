import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

const DetailsSection = () => {
    const {
        register,
        formState: { errors },
      } = useFormContext<HotelFormData>();
    
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
          <label className="text-gray-700 text-sm font-bold flex-1" key="name">
            Name
            <input
              type="text"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("name", { required: "This field is required" })}
            ></input>
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </label>
    
          <div className="flex gap-4">
            <label className="text-gray-700 text-sm font-bold flex-1">
              City
              <input
                type="text"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("city", { required: "This field is required" })}
              ></input>
              {errors.city && (
                <span className="text-red-500">{errors.city.message}</span>
              )}
            </label>
          </div>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Description
            <textarea
              rows={10}
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("description", { required: "This field is required" })}
            ></textarea>
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-semibold">
            Price Per Night
            <input
              type="number"
              min={1}
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("pricePerNight", { required: "This field is required" })}
            ></input>
            {errors.pricePerNight && (
              <span className="text-red-500">{errors.pricePerNight.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-semibold">
            Star Rating
            <select
              {...register("starRating", {
                required: "This field is required",
              })}
              className="border rounded w-full p-2 text-gray-700 font-normal"
            >
              <option key="" value="" className="text-sm font-bold">
                Select as Rating
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            {errors.starRating && (
              <span className="text-red-500">{errors.starRating.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-semibold">
  Rooms Available
  <input
    className="border rounded w-full py-2 px-3 font-normal"
    type="number"
    min={1}
    {...register("roomCount", {
      required: "This field is required",
    })}
  />
  {errors.roomCount && (
    <span className="text-red-500 text-sm font-bold">
      {errors.roomCount?.message}
    </span>
  )} 
 </label>
        </div>
      );
    };
    
    export default DetailsSection;