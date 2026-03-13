import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get email safely (state OR localStorage)
  const email =
    location.state?.email || localStorage.getItem("otpEmail");

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect if email is missing
  useEffect(() => {
    if (!email) {
      setMessage("No email found. Please signup first.");
      setTimeout(() => navigate("/signup"), 2000);
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://user-tracking-1.onrender.com/api/auth/verifyOtp",
        { email, otp }
      );

      setMessage(res.data.message || "OTP Verified ✅");

      // ✅ Clear stored email after success
      localStorage.removeItem("otpEmail");

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Invalid OTP ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Verify OTP</h2>

        {message && (
          <div className="alert alert-info text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              className="form-control"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6} // Restrict input length
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading || !otp || otp.length !== 6} // Disable if invalid
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerify;