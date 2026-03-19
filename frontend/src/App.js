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

  const [isAuth, setIsAuth] = useState(() => {
    return localStorage.getItem("isAuth") === "true";
  });

  const handleSetAuth = (status) => {
    localStorage.setItem("isAuth", status);
    setIsAuth(status);
  };

  return (
    <div className="App">
      {!hideNavbar && <Navbar isAuth={isAuth} setIsAuth={handleSetAuth} />}

      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/Adminpanel" replace /> : <Login setIsAuth={handleSetAuth} />}
        />

        <Route path="/signup" element={<Signup />} />

        <Route path="/otpverify" element={<OtpVerify />} />

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

        <Route path="/t/:shortId" element={<Tracker />} />

        <Route
          path="/analytics/:shortId"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
