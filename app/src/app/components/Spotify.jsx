"use client";
import { useEffect, useRef, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import YTSearch from "./YTSearch";
import axios from "axios";

const spotifyApi = new SpotifyWebApi();

// Trying to get further endpoints for spotify data through a different entry point, this is not implemented

("https://api.spotify.com/v1/playlists/0RnoDWveXUHNhjYjNLao1S/tracks?fields=items%28track%28name%2Calbum%28artists%29%29%29");

// const response = await fetch(
//     `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${props.name}&type=video&key=AIzaSyBBo5cFjznqSWqZ6OZMnsOZYr_baZ1eAxQ`
//   );
//   const res = await response.json();
//   const video = `https://www.youtube.com/embed/` + res.items[0].id.videoId;
//   console.log(video);
//   setVideo(video);

// Component used to retrieve user authentication and current song playing. I was also trying to implement a playlist feature although some of the endpoints were not working and another API may be needed.

export default function Spotify() {
  const [token, setToken] = useState("");
  const [playing, setplaying] = useState({});
  const [user, setUser] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [songData, setSongData] = useState([]);
  //   const playlist = [];

  // useeffect to authenticate user

  useEffect(() => {
    const token = getToken().access_token;
    window.location.hash = "";

    if (token) {
      setToken(token);
      spotifyApi.setAccessToken(token);
      setUser(true);
      // getSongs();
      //   getPlaylist();
      //   spotifyApi.getUserPlaylists().then((response) => {
      //     setPlaylists(
      //       response.items.map((playlist) => {
      //         return {
      //           name: playlist.name,
      //           tracksUrl: playlist.tracks.href,
      //         };
      //       })
      //     );
      //   });
    }
  });

  // Trying to get further endpoints for spotify data through a different entry point, this is not implemented

  // const getSongs = () => {
  //   spotifyApi.getPlaylistTracks("0RnoDWveXUHNhjYjNLao1S").then((response) => {
  //     setSongData(
  //       response.items.map((song) => {
  //         return {
  //           name: song.track.name,
  //           // artist: song.track.artists[0].name,
  //         };
  //       })
  //     );
  //   });
  // };

  // Get current song and artist data

  const getNowPlaying = async () => {
    await spotifyApi.getMyCurrentPlaybackState().then((response) => {
      setplaying({
        artist: response.item.artists[0].name,
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
      });
    });
  };

  // Get authentication token

  const getToken = () => {
    return window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        let parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
  };

  // use forwardRef to use function on YTSearch component. This made the UI cleaner although it also created issues with setting data as it sometimes takes multiple clicks to set the song data. It worked fine with the button in the YTSearch component.

  const YTRef = useRef();

  // Renders a Login button and the  YTSearch component which displays the screen
  // Once logged in the app conditionally renders user UI to get song and video data.
  return (
    <div>
      <YTSearch
        user={user}
        name={playing.name}
        artist={playing.artist}
        ref={YTRef}
      />
      {!user ? (
        <div className="login">
          <a className="button" href={`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8888"}/login`}>
            Login
          </a>
        </div>
      ) : (
        <div className="buttons">
          <div className="but">
            <button className="button" onClick={YTRef.current.passVideo}>
              {" "}
              Get video
            </button>
            <button className="button" onClick={() => getNowPlaying()}>
              {" "}
              Get Song
            </button>
          </div>
          <marquee width="50%">
            {playing.name}, by {playing.artist}
          </marquee>
          <div>
            <img src={playing.albumArt} style={{ height: 150 }} />
          </div>

          {/* // Trying to get further endpoints for spotify data through a different entry point, this is not implemented */}

          {/* <div>
            {playlists.map((playlist) => (
              <button onClick={getSongs()} key={playlist.name}>
                {playlist.name}
              </button>
            ))}
          </div> */}
          {/* <div>
            <button>Songs</button>
            {songData.map((song) => {
              <p>{song.name}</p>;
            })}
          </div> */}
        </div>
      )}
    </div>
  );
}
