/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/documentation/web-api/tutorials/code-flow
 */

var express = require("express");
var axios = require("axios");
var crypto = require("crypto");
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");

// Load environment variables
var client_id = process.env.SPOTIFY_CLIENT_ID || "d2756b0719ed438fa8c800b20730b123";
var client_secret = process.env.SPOTIFY_CLIENT_SECRET || "ec323e9f5d6a4eccbc2b13026bb14106";
var redirect_uri = process.env.SPOTIFY_REDIRECT_URI || "http://localhost:8888/callback";
var frontend_url = process.env.FRONTEND_URL || "http://localhost:3000";
var port = process.env.PORT || 8888;

const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

var stateKey = "spotify_auth_state";

var app = express();

// Configure CORS to allow requests from frontend
var allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://192.168.0.231:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

app.get("/login", function (req, res) {
  console.log("Login endpoint hit from:", req.headers.origin || req.headers.referer);
  console.log("Using redirect_uri:", redirect_uri);
  console.log("Using client_id:", client_id);
  var state = generateRandomString(16);
  
  // Set cookie with proper options for cross-origin requests
  var isProduction = process.env.NODE_ENV === "production";
  res.cookie(stateKey, state, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production (HTTPS)
    sameSite: isProduction ? "none" : "lax", // Allow cross-site in production
    maxAge: 600000, // 10 minutes
  });

  // your application requests authorization
  var scope =
    "user-read-private user-read-email user-read-playback-state user-modify-playback-state playlist-read-private";
  
  var authUrl = "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    });
  
  console.log("Redirecting to Spotify with URL:", authUrl);
  res.redirect(authUrl);
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log("Callback endpoint hit");
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  
  console.log("State check - received:", state, "stored:", storedState);

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      data: querystring.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    };

    axios(authOptions)
      .then(function (response) {
        var access_token = response.data.access_token,
          refresh_token = response.data.refresh_token;

        // use the access token to access the Spotify Web API
        axios
          .get("https://api.spotify.com/v1/me", {
            headers: { Authorization: "Bearer " + access_token },
          })
          .then(function (userResponse) {
            console.log(userResponse.data);
          })
          .catch(function (error) {
            console.error("Error fetching user info:", error);
          });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          frontend_url + "/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      })
      .catch(function (error) {
        console.error("Error getting access token:", error);
        res.redirect(
          frontend_url + "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      });
  }
});

app.get("/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  };

  axios(authOptions)
    .then(function (response) {
      var access_token = response.data.access_token,
        refresh_token = response.data.refresh_token;
      res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    })
    .catch(function (error) {
      console.error("Error refreshing token:", error);
      res.status(500).send({ error: "Failed to refresh token" });
    });
});

var HOST = "0.0.0.0"; // Listen on all interfaces

app.listen(port, HOST, function () {
  console.log("Server listening on http://" + HOST + ":" + port);
  console.log("Environment:", process.env.NODE_ENV || "development");
  console.log("Frontend URL:", frontend_url);
  console.log("Redirect URI:", redirect_uri);
});
