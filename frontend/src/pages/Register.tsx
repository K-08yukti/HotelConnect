import React,{ useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  secretKey?: string; // Optional secret key field
};

const Register = () => {
  const [role, setRole] = useState("");
// const [role, setRole] = useState<"user" | "admin">("user"); // Explicitly typed as "user" | "admin"
const [secretKey, setSecretKey] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>();

  
  useEffect(() => {
    setSecretKey("");
  }, []);
  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    data.role=role;
    console.log("Form Data:", data); 
    console.log("Entered Secret Key:", secretKey);
    console.log("role: ",role);
    if (role === "admin" && secretKey !== "heysecretkey") {
      showToast({ message: "Invalid Admin", type: "ERROR" });
      return;
    }
    mutation.mutate(data);
  });
//

  return (
    <div style={{ height: "400px", overflowY: "auto" }}>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Create an Account</h2>
        <div className="flex items-center gap-3">
          <label className="text-gray-700">
            <input
              type="radio"
              value="user"
              checked={role === "user"}
              onChange={(e)=>setRole(e.target.value)}
            />
            User
          </label>
          <label className="text-gray-700">
            <input
              type="radio"
              value="admin"
              checked={role === "admin"}
              onChange={(e)=>setRole(e.target.value)}

            />
            Admin
          </label>
        </div>
        
        <div className="flex flex-col md:flex-row gap-5">
          <label className="text-gray-700 text-sm font-bold flex-1">
            First Name
            <input className="border rounded w-full py-1 px-2 font-normal"{...register("firstName", { required: "This field is required" })}
            ></input>
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </label>

          <label className="text-gray-700 text-sm font-bold flex-1">
            Last Name
            <input className="border rounded w-full py-1 px-2 font-normal"
              {...register("lastName", { required: "This field is required" })}
            ></input>
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )}
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <label className="text-gray-700 text-sm font-bold flex-1">
            Email
            <input
              type="text"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("email", {
                required: "This field is required",
                validate: (value) =>
                  value.includes("@gmail.com") ||
                  "Please enter valid gmail ",
              })}
            ></input>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Phone Number
            <input
              type="text"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("phone", {
                required: "This field is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </label>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <label className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input
              type="password"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("password",
                {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
            ></input>
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Confirm Password
            <input
              type="password"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("confirmPassword",
                {
                  validate: (val) => {
                    if (!val) {
                      return "This field is required";
                    } else if (watch("password") !== val) {
                      return "Your passwords do not match";
                    }
                  },
                })}
            ></input>
            {errors.confirmPassword && (
              <span className="text-red-500">{errors.confirmPassword.message}</span>
            )}
          </label>
        </div>
        {role === "admin" && ( // Render secret key field only for admin role
          <label className="text-gray-700 text-sm font-bold flex-1">
            Secret Key
            <input
              type="password"
              className="border rounded w-full py-1 px-2 font-normal"
              value={secretKey} // Add value attribute to bind the input field to the state
              onChange={(e) => setSecretKey(e.target.value)} // Update the state when the input field changes
            
            />
          </label>
        )}
        
        <span>
          <button type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
            Create Account
          </button>
        </span>
      </form>
    </div>
  );
};

export default Register;

