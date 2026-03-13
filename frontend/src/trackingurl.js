import React, { useState } from 'react';
import axios from 'axios';

const TrackingUrl = () => {

  const [inputUrl, setInputUrl] = useState("");
  const [displayLink, setDisplayLink] = useState('');
  const [realLink, setRealLink] = useState('');

  const handleGenerate = async () => {

    try {

      const res = await axios.post(
        "https://user-tracking-1.onrender.com/api/auth/generate",
        {
          destinationUrl: inputUrl
        }
      );

      if (res.data.success) {

        const shortId = res.data.id;

        const link = `https://user-tracking-ebon.vercel.app/t/${shortId}`;

        setDisplayLink(link);
        setRealLink(link);

      }

    } catch (err) {

      alert("Error: Check if backend is running");

    }

  };

  const handleCopy = () => {

    navigator.clipboard.writeText(realLink);
    alert("Copied!");

  };

  return (
    <div>

      <input
        type="text"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
        placeholder="Enter domain (e.g. https://flipkart.com)"
      />

      <button onClick={handleGenerate}>
        Generate
      </button>

      {displayLink && (

        <div>

          <p>Tracking Link: {displayLink}</p>

          <button onClick={handleCopy}>
            Copy Tracking Link
          </button>

        </div>

      )}

    </div>
  );

};

export default TrackingUrl;