import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminPanel from "./admin";
import Login from "./Login";
import OtpVerify from "./otpverify";
import "./App.css";
import Navbar from "./Navbar";
import ProfilePage from "./user";
import TrackingUrl from "./trackingurl";
import Tracker from "./Track";
import Signup from "./Register";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/t/");

  // simple auth state
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={isAuth ? <Navigate to="/admin" /> : <Login setIsAuth={setIsAuth} />}
        />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* OTP */}
        <Route path="/otpverify" element={<OtpVerify />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" />}
        />

        {/* User Profile */}
        <Route
          path="/user"
          element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
        />

         
        <Route
          path="/trackingurl"
          element={isAuth ? <TrackingUrl /> : <Navigate to="/" />}
        />

        
        <Route path="/t/:shortId" element={<Tracker />} />

         <Route
          path="/analytics/:shortId"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" />}
        />

         <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
}

export default App;