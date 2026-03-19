import { useState } from 'react';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import './App.css';

// Added setIsAuth to props
function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  }); 
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://user-tracking-1.onrender.com/api/auth/login",
        formData
      );

       setIsAuth(true); 
      
      setMessage(res.data.message || "Login successful 🎉");

       setTimeout(() => {
        navigate("/Adminpanel");
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mt-5 col-md-4">
        <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
          <h1 className="text-center text-white">Login</h1>

          {message && (
            <div className="alert alert-info text-center">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="form-control"
                placeholder="Email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                onChange={handleChange}
                placeholder="Password"
                required
              />
              <Link className="text-red mt-3 d-block" to="/forgetpassword">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-send w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="signup-login-link text-center mt-3">
              Don't have any account? <Link to="/signup"> Signup</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
