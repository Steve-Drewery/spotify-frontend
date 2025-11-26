"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Spotify from "./components/Spotify";
import Card from "./components/Card";
import { useEffect } from "react";
import axios from "axios";
// Trying to get further endpoints for spotify data through a different entry point, this is not implemented
// const code = new URLSearchParams(window.location.search).get("code");

export default function Home() {
  // Trying to get further endpoints for spotify data through a different entry point, this is not implemented
  // useEffect(() => {
  //   axios
  //     .post("http://localhost:3001/login", {
  //       code,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //     });
  // });

  // Renders Spotify and Card components
  return (
    <div>
      {/* <Login /> */}
      <div id="background">
        <Spotify />
      </div>
      <Card />
    </div>
  );
}
