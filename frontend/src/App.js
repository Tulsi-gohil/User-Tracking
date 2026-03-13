import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AdminPanel from './admin';
import Login from './Login';
import OtpVerify from './otpverify';
import './App.css';
import Navbar from './Navbar'; 
import ProfilePage from './user'; 
import TrackingUrl from './trackingurl';
import Tracker from './Track'; 
import Signup from './Register';

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

  // Check if user is logged in
  const isAuth = localStorage.getItem("token"); // you can change token logic based on your auth system

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
         <Route path="/" element={isAuth ? <Navigate to="/admin" /> : <Login />} />

         <Route path="/signup" element={<Signup />} />

         <Route path="/otpverify" element={<OtpVerify />} />

         <Route path="/admin" element={isAuth ? <AdminPanel /> : <Navigate to="/" />} />

       
        <Route path="/user" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />

     
        <Route path="/trackingurl" element={isAuth ? <TrackingUrl /> : <Navigate to="/" />} />
 
        <Route path="/t/:shortId" element={<Tracker />} />
 
        <Route path="/analytics/:shortId" element={isAuth ? <AdminPanel /> : <Navigate to="/" />} />
 
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;