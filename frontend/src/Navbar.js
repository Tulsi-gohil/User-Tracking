import { Link } from "react-router-dom";
import "./App.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <Link className="navbar-brand fw-bold" to="/">
        Admin Panel
      </Link>

 
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
        aria-controls="nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* MENU */}
      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto text-center">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/"> Dashboard</Link>
          </li>
           <li className="nav-item">
            <Link className="nav-link text-white" to="/trackingurl"> Tracking Url</Link>
          </li>
         <li className="nav-item">
            <Link className="nav-link text-white" to="/user"> profile</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/Signup">Signup</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/Login">Login</Link>
          </li>
          
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
 