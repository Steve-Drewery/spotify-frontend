import React from "react";

// Simple card for application details

export default function Card() {
  return (
    <div>
      <div className="col">
        <div className="card">
          <h2>Spotify Music Video Player - How to...</h2>
          <p>
            This application allows users to play music videos while logged into
            their spotify account.
          </p>
          <p>
            To use this app all you need is a spotify account. Simply log in
            through the login button.{" "}
          </p>
          <p>Ensure you have something playing on your spotify account.</p>
          <p>
            Click the get song button to load content (May need to click twice)
            and then press the get video button.
          </p>
          <h4>Technical Details</h4>
          <p>
            The application uses API calls from spotify for authentication and
            retrieves music data including the song and artist you're listening
            to. The song is then requested through youtube using the artist and
            song name in the query and then displayed in the video player.
          </p>
          <h4>Permissions</h4>
          <p>
            The spotify authenticator needs permissions from your spotify
            profile to collect the current song you're listening to.
          </p>
        </div>
      </div>
    </div>
  );
}
