
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import AddHotel from "./pages/AddHotel";
// import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import UserSearch from "./pages/myUsers";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import LandingPage from "./landing";
import MyBookings from "./pages/MyBookings";
import TotalBooking from "./pages/totalbooking";

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <LandingPage />
        }
        />
        <Route path="/search" element={
          <Layout>
            <Search />
          </Layout>
        }
        />
        <Route path="/detail/:hotelId" element={
          <Layout>
            <Detail />
          </Layout>
        }
        />
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          } />
        <Route path="/Profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          } />
        <Route path="/hotel/:hotelId/booking"
          element={
            <Layout>
              <Booking />
            </Layout>
          } />
        <Route path="/add-hotel"
          element={
            <Layout>
              <AddHotel />
            </Layout>
          } />
        <Route
          path="/edit-hotel/:hotelId"
          element={
            <Layout>
              <EditHotel />
            </Layout>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <Layout>
              <MyBookings />
            </Layout>
          }

        />
        <Route
          path="/all-bookings"
          element={
            <Layout>
              <TotalBooking />
            </Layout>
          }
          />
        <Route
          path="/my-hotels"
          element={
            <Layout>
              <MyHotels />
            </Layout>
          }
        />
        <Route path="/myUsers"
          element={
            <Layout>
              <UserSearch />
            </Layout>
          } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
