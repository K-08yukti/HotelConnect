import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  emailOrPhone: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const location= useLocation();
  const navigate = useNavigate();


  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(
    apiClient.signIn,
    {
      onSuccess: async () => {
        showToast({ message: "Sign in Successful!", type: "SUCCESS" });
        await queryClient.invalidateQueries("validateToken");
        navigate(location.state?.from?.pathname || "/");
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    }
  );

  const onSubmit = handleSubmit(async (data: SignInFormData) => {
    await mutation.mutate(data);
    
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>

          <label className="text-gray-700 text-sm font-bold flex-1">
            Email or Phone Number
            <input
              type="text"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("emailOrPhone", {
                required: "This field is required",
                validate: (value) =>
                  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(value) || // Check if value is a valid email
                  /^\d{10}$/.test(value) || // Check if value is a 10-digit phone number
                  "Please enter a valid email or phone number",
              })}
            />
            {errors.emailOrPhone && (
              <span className="text-red-500">{errors.emailOrPhone.message}</span>
            )}
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input
              type="password"
              className="border rounded w-full py-1 px-2 font-normal"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </label>
        
      


      <span className="flex items-center justify-between">
        <span className="text-sm">
          
              Not Registered?{" "}
              <Link className="underline" to="/register">
                Create an account here
              </Link>
        </span>
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
        >
          Login
        </button>
      </span>
    </form>
  );
};

export default SignIn;

