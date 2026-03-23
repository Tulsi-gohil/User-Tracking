  import { useState } from "react";
  import axios from "axios";
  import "./App.css";
  import { useNavigate, Link } from "react-router-dom";

  function Signup() {
      const navigate = useNavigate();

    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
    
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
     const token = localStorage.getItem("token")

      const res = await axios.post(
        
        "https://user-tracking-1.onrender.com/api/auth/ragister",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        {
          headers: {
            "Content-Type": "application/json",
           }
        }
      );

      setMessage(res.data.message || "Signup successful 🎉");

      navigate("/Adminpanel");

    } catch (err) {
       setMessage(
        err.response?.data?.message || "Signup failed ❌"
      );
    } finally {
      setLoading(false);
    }
  }; 
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center text-white mb-4">Signup</h2>

          {message && (
            <div className="alert alert-info text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label text-white">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
  

            {/* Password */}
            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-send w-100"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            {/* Login Link */}
            <p className="signup-login-link text-center mt-3">
              Already have an account?{" "}
              <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  export default Signup;