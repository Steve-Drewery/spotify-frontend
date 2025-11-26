import React, { forwardRef, useImperativeHandle, useState } from "react";

// This component handles the youtube fetch and displays the music video as an embedded video using iframe.

const YTSearch = forwardRef(({ artist, name }, ref) => {
  //   const [search, setSearch] = useState("");
  const [video, setVideo] = useState("");
  useImperativeHandle(ref, () => {
    return {
      passVideo: passVideo,
    };
  });

  // Get video data and pass to Spotify component through forwardref.

  const passVideo = async () => {
    console.log("passVideo called with:", { artist, name });
    if (!artist || !name || artist === "" || name === "") {
      console.error("Missing artist or name", { artist, name });
      alert("Please click 'Get Song' first to load the current song information before searching for a video.");
      return;
    }
    
    try {
      const searchQuery = `${name} ${artist}`;
      console.log("Searching YouTube for:", searchQuery);
      
      const youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "AIzaSyDpyLwkMH1IsrFXBA_mYdZCS4cge1V8DmA";
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(searchQuery)}&type=video&key=${youtubeApiKey}`;
      
      const response = await fetch(apiUrl);
      const res = await response.json();
      
      // Check for API errors in the response (YouTube API returns errors in JSON even with 400 status)
      if (res.error) {
        console.error("YouTube API Error Response:", res.error);
        const errorMsg = res.error.message || "YouTube API error";
        if (res.error.errors && res.error.errors.length > 0) {
          const firstError = res.error.errors[0];
          console.error("First error detail:", firstError);
          if (firstError.reason === "quotaExceeded") {
            alert("YouTube API quota exceeded. Please try again later.");
          } else if (firstError.reason === "keyInvalid") {
            alert("YouTube API key is invalid. Please contact the administrator.");
          } else if (firstError.reason === "badRequest") {
            alert(`YouTube API Bad Request: ${firstError.message || errorMsg}. The API key may need to be configured.`);
          } else {
            alert(`YouTube API Error: ${firstError.message || errorMsg} (Reason: ${firstError.reason})`);
          }
        } else {
          alert(`YouTube API Error: ${errorMsg}`);
        }
        return;
      }
      
      if (!response.ok) {
        console.error("HTTP Error:", response.status, response.statusText);
        console.error("Response body:", res);
        alert(`Failed to connect to YouTube API (Status: ${response.status}). Check console for details.`);
        return;
      }
      
      // Check if we have results
      if (!res.items || res.items.length === 0) {
        console.error("No YouTube results found for:", searchQuery);
        console.log("Full API response:", res);
        alert(`No video found for "${searchQuery}". Please try another song.`);
        return;
      }
      
      // Check if the video ID exists
      if (!res.items[0].id || !res.items[0].id.videoId) {
        console.error("Invalid video ID in response:", res.items[0]);
        console.log("Full API response:", res);
        alert("Error: Invalid video data received from YouTube.");
        return;
      }
      
      const video =
        `https://www.youtube.com/embed/` +
        res.items[0].id.videoId +
        `?autoplay=1`;
      console.log("Video URL set:", video);
      setVideo(video);
    } catch (error) {
      console.error("Error fetching YouTube video:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Failed to load video: ${error.message || "Unknown error"}. Please check the browser console for details.`);
    }
  };
  return (
    <div>
      <div id="monitor">
        {video ? (
          <iframe
            allow="autoplay"
            allowFullScreen
            id="monitorscreen"
            width="420"
            height="315"
            src={video}
          ></iframe>
        ) : (
          <div id="static">
            <div id="monitorscreen"></div>
          </div>
        )}
      </div>
      {/* {props.user && <button className="button"> Get video</button>} */}
    </div>
  );
});
export default YTSearch;
