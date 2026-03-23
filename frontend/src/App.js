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

  // Initialize state from localStorage to persist login on refresh
  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const handleSetAuth = (status) => {
    if (status) {
      localStorage.setItem("isAuth", "true");
    } else {
      localStorage.removeItem("isAuth");
      localStorage.removeItem("token");  
    }
    setIsAuth(status);
  };

  return (
    <div className="App">
      {!hideNavbar && <Navbar isAuth={isAuth} setIsAuth={handleSetAuth} />}

      <Routes>
        {/* Redirect to Admin if already logged in */}
        <Route
          path="/"
          element={isAuth ? <Navigate to="/AdminPanel" replace /> : <Login setIsAuth={handleSetAuth} />}
        />
        <Route 
          path="/Login" 
          element={isAuth ? <Navigate to="/AdminPanel" replace /> : <Login setIsAuth={handleSetAuth} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otpverify" element={<OtpVerify />} />

        {/* Protected Routes: Redirect to home if NOT authenticated */}
        <Route
          path="/AdminPanel"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" replace />}
        />
        <Route
          path="/user"
          element={isAuth ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/trackingurl"
          element={isAuth ? <TrackingUrl /> : <Navigate to="/" replace />}
        />
        <Route
          path="/analytics/:shortId"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
