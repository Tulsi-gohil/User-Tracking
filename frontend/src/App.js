import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />

        
        <Route
          path="/admin"
          element={isAuth ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route path="/" element={<AdminPanel />} />
        <Route path="/analytics/:shortId" element={<AdminPanel />} />
        <Route path="/t/:shortId" element={<Tracker />} />
        <Route path='/analytics/:shortId'  element={<AdminPanel/>} />
        <Route path='/Signup' element={<Signup/>}   />
        <Route path="/User" element={<ProfilePage />} />
        <Route path="/otpverify" element={<OtpVerify />} />
         <Route path="/trackingurl" element={<TrackingUrl />} />
      </Routes>
    </div>
  );
}

export default App;