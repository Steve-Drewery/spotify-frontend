import React from "react";

// Trying to get further endpoints for spotify data through a different entry point, this is not implemented

const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=d2756b0719ed438fa8c800b20730b123&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state";

export default function Login() {
  return (
    <div>
      <a href={AUTH_URL}>Login</a>
    </div>
  );
}
