import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Navbar({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuth(false); // This triggers the cleanup in App.js
    navigate("/Login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3">
      <Link className="navbar-brand fw-bold " to="/">Admin Panel</Link>

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

      <div className="collapse navbar-collapse" id="nav">
        <ul className="navbar-nav ms-auto text-center">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/trackingurl">Tracking Url</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/user">Profile</Link>
          </li>

           {!isAuth && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/signup">Signup</Link>
            </li>
          )}

          <li className="nav-item">
            {isAuth ? (
              <button
                className="nav-link text-danger bg-transparent border-0 w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link className="nav-link text-white" to="/Login">Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
