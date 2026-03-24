import React, { useState } from 'react';
import axios from 'axios';

const TrackingUrl = () => {

  const [inputUrl, setInputUrl] = useState("");
  const [displayLink, setDisplayLink] = useState('');
  const [realLink, setRealLink] = useState('');

  const handleGenerate = async () => {

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post(
        "https://user-tracking-1.onrender.com/api/auth/generate",
        {
          destinationUrl: inputUrl
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {

        const shortId = res.data.id;

        const link = `https://user-tracking-six.vercel.app/t/${shortId}`;

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
    <>
      <div className='admin-text'> <h2> Create Tracking Url</h2></div>
      <div className='url'>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Enter domain (e.g. https://flipkart.com)"
        />

        <button className='button3' onClick={handleGenerate}>
          Generate
        </button>
      </div>
      {displayLink && (
        <div className='trackurl' >
          <div className='trackingurl'>

            <p>  {displayLink}</p>
          </div>

         <button className='button-url' onClick={handleCopy}>
            Copy Tracking Link
          </button> 



        </div>
      )}



    </>
  )
};

export default TrackingUrl;