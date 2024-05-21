import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header = () => {
    const { isLoggedIn, userRole } = useAppContext(); // Assuming you have userRole in your AppContext

    return (
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">HotelConnect</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? (
                        <>
                            {userRole === "admin" ? (
                                <>
                                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/all-bookings">
                                        Bookings made
                                    </Link>
                                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/myUsers">
                                        User Search
                                    </Link>
                                    
                                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-hotels">
                                        Add Hotels
                                    </Link>
                                </>
                            ) : (
                                <>
                                 
                                    <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-bookings">
                                        My Bookings
                                    </Link>
                                </>
                            )}
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/Profile">
                                My Profile
                            </Link>
                            <SignOutButton />
                        </>
                    ) : (
                        <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100">
                            Sign In
                        </Link>
                    )}
                </span>
            </div>
        </div>
    );
};

export default Header;

