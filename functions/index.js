const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

const path = require("path");
const request = require("request");
const querystring = require("querystring");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp(functions.config().firebase);
const app = express();

exports.testing = functions.https.onRequest((req, res) => {
    return "Testing that this function is called"
    
})

// testing the login process
//needs to be the client ID for the app created on Spotify 
const client_id = "24f12425b4164b78aba2fd10b011fe20";
const client_secret = "da7500969f0c4a7bac29ba61b13e90c7";
const redirect_uri = "http://127.0.0.1:5001/honours-project-24ce1/us-central1/app/callback";
const stateKey = "spotify_auth_state";

const pagelink = "http://127.0.0.1:5001/honours-project-24ce1/us-central1/app"

let userAccessToken = ""

app.get("/restt", (req, res) => {
  res.status(200).send({data: "some data"});
});


let generateRandomString = function(length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


app.get("/login", function(req, res) {
  console.log("INSIDE LOGIN");
  let state = generateRandomString(16);
  let scope = "user-read-private user-read-email user-read-playback-state";
  res.cookie(stateKey, state);
  console.log("Redirecting to spotify");
  console.log(querystring.stringify({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state
  }));
  res.redirect("https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get("/callback", function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter6
  console.log("INSIDE CAllback");
  console.log(req.query);
  console.log(req.cookies);

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  console.log(code);
  console.log(state);
  console.log(storedState);
  

//   if (state === null || state !== storedState) {
//     res.redirect("/#" +
//       querystring.stringify({
//         error: "state_mismatch"
//       }));
//   } else {
    //res.clearCookie(stateKey);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        "Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64"))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        let access_token = body.access_token,
            refresh_token = body.refresh_token;
        userAccessToken = access_token;

        let options = {
          url: "https://api.spotify.com/v1/me",
          headers: { "Authorization": "Bearer " + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(pagelink + "/#" +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect(pagelink+ "/#" +
          querystring.stringify({
            error: "invalid_token"
          }));
      }
    });
  }
);

app.get("/refresh_token", function(req, res) {

  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: { "Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64")) },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      userAccessToken = access_token;
      res.send({
        "access_token": access_token
      });
    }
  });
});

/* GET home page. */
app.get("/", function(req, res, next) {
  //res.render("login");
  console.log(path.join(__dirname, "/"));
  res.sendFile(path.join(__dirname, "/views/login.html"));
});

// test to get data from a user
app.get("/history", async function(req, res) {
  let options = {
    url: "https://api.spotify.com/v1/me/player/currently-playing",
    headers: { "Authorization": "Bearer " + userAccessToken},
    json: true
  }
  
  request.get(options, function(error, response, body) {
    console.log("GETTING DATA")
    console.log(body)
  
  }) 

  console.log("GETTING DEVICE")
  console.log(userAccessToken)

})

exports.app = functions.https.onRequest(app);
