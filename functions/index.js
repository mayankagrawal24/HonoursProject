const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore()
const cors = require('cors')({ origin: true });

const path = require("path");
//const request = require("request");
const request = require('request-promise')
const querystring = require("querystring");

const { Expo } = require("expo-server-sdk");
const expo = new Expo();


//Spotify connection information
const CLIENT_ID = "24f12425b4164b78aba2fd10b011fe20";
const CLIENT_SECRET = "da7500969f0c4a7bac29ba61b13e90c7";
const  REDIRECT_URI = "exp://192.168.0.55:19000";
const SCOPES = "allowingAccess";

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


//const app = express();

exports.testing = functions.https.onRequest((req, res) => {
    return res.status(200).send({data: "GOOD"});
    
});

//This function is for setting up the users connection to spotify
//Requires getting access token to make api calls on their behalf
exports.createUserDoc = functions.https.onCall(async (data, context) => {
  //return "Creating the user doc"
  functions.logger.log("ENTERED THE FUNCTION CALL");
  functions.logger.log(data);

  var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
          code: data.code,
          redirect_uri: REDIRECT_URI,
          scope: SCOPES,
          grant_type: 'authorization_code'
      },
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
      },
      json: true
  };

  functions.logger.log("Auth Options");
  functions.logger.log(authOptions);
  // querying to get the access token
  let tokens = await request.post(authOptions);

  //console.log(tokens)
  functions.logger.log("TOKENS:")
  functions.logger.log(tokens)


  // now query and get the spotify user personal info++++++++++
  var options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { 'Authorization': 'Bearer ' + tokens.access_token },
      json: true
  };
  // use the access token to access the Spotify Web API
  let userDataSpotify = await request.get(options);
  functions.logger.log("SPOTIFY USER DATA: ")
  functions.logger.log(userDataSpotify)
  

  // checking if user in db, if not add them
  // replace the user id with context.auth.uid
  functions.logger.log(context.auth, "THIS IS AUTH")
  var userRef = firestore.doc(`user/${context.auth.uid}`);
  var userDoc = await userRef.get().catch((error) => {
      functions.logger.log("Firestore user retrieval failed", error);
      throw new functions.https.HttpsError("Firestore user retrieval failed", error);
  });

  if (!userDoc.exists || !userDoc.data().access_token) {
      var dt = new Date();
      dt = dt.getTime();
      dt += 3540000 // expiry time 59 seconds
      userDoc = {
          // same as the spotify user id
          uid: context.auth.uid,
          spotifyId: userDataSpotify.id,
          email: userDataSpotify.email,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expiry: dt
      }

      // // create a stripe customer for them
      // const stripeCustomer = stripe.customers.create({
      //     email: userDataSpotify.email,
      //     description: `Firebase uid: ${context.auth.uid}`,
      // });

      // setting the new user data
      userRef.set(userDoc,
          { merge: true }
      ).catch((error) => {
          functions.logger.log("Firestore user write failed", error);
          throw new functions.https.HttpsError("Firestore user write failed", error);
      })
  } 
  
  else {
      userDoc = userDoc.data()
  }


  return userDoc
});

// checks if access token needs to be refreshed, if yes refreshes it
async function refreshAccessToken(refresh_token, uid) {
  // requesting access token from refresh token
  functions.logger.log("Refresh Access token is called");
  var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
      form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
      },
      json: true
  };

  // gets the new access token
  let { access_token } = await request.post(authOptions);
  var dt = new Date();
  dt = dt.getTime();
  dt += 3540000 // expiry time 59 seconds
  //   updates the users access token inside firestore
  var userRef = firestore.doc(`user/${uid}`);
  userRef.update({
      access_token: access_token,
      token_expiry: dt
  })

  return access_token
  // let newAccess_token = await refreshAccessToken(tokens.refresh_token, userDataSpotify.id)
}

// Starts and ends challenges
exports.pollToLookForPodcast = functions.pubsub.schedule('* * * * *')
    .timeZone('America/New_York') // Should be starting utc time
    .onRun(async (context) => {
        functions.logger.log("STARTING THE PUBSUB JOB");
        // we query the users currently listening thing
        // if its something new then store it in the db with a timestamp
        let userRef = firestore.collection(`user`)
        let usersDoc = await userRef.get()
        usersDoc.forEach(async (userDoc) => {
            //  checking if the access token has expired or nah
            let { access_token, refresh_token, uid, token_expiry, notifToken } = userDoc.data()

            // if the user hasnt setup spotify yet hten ignore
            if (!access_token) return
            var dt = new Date();
            dt = dt.getTime();
            // MAKE SURE THE UID IS THE FIREBASE UID AND NO LONGER THE SPOTIFY USER UID
            if (dt >= token_expiry) access_token = await refreshAccessToken(refresh_token, uid)

            // create call to see if they listening to anything rn
            var options = {
                url: 'https://api.spotify.com/v1/me/player?additional_types=episode',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            // use the access token to access the Spotify Web API
            let listeningData = await request.get(options)

            // this will be empty if the user is not listening to anything
            if (listeningData && listeningData.currently_playing_type == "episode") {
                let { id, description, name, images, show } = listeningData.item

                functions.logger.log("USER IS LISTENING TO PODCAST");

                //Query the podcasts collection to see if the podcast exists in our collection
                var podcastRef = firestore.doc(`podcast/${id}`);
                var podcastDoc = await podcastRef.get().catch((error) => {
                  functions.logger.log("Firestore user retrieval failed", error);
                  throw new functions.https.HttpsError("Firestore user retrieval failed", error);
              });

              if (!podcastDoc.exists) {
                podcastDoc = {
                  id: id,
                  image: images,
                  title: name,
                  description: description,
                  showName: show.name,
                  spotifyUrl: show.external_urls.spotify,
                }
                await podcastRef.set(podcastDoc, { merge: true })
              }
                // if yes -> do nothing
                // if no -> create the podcast 


                // query the users db for the episode 
                var noteRef = firestore.doc(`user/${uid}/notes/${id}`);
                var noteDoc = await noteRef.get().catch((error) => {
                    functions.logger.log("Firestore user retrieval failed", error);
                    throw new functions.https.HttpsError("Firestore user retrieval failed", error);
                });

                // if the doc doesnt exist, then create it
                if (!noteDoc.exists) {
                    // setting the new user data
                    functions.logger.log("NOTE DOES NOT EXIST FOR USER, CREATING IT");

                    noteDoc = {
                        id: id,
                        image: images,
                        title: name,
                        description: description,
                        showName: show.name,
                        spotifyUrl: show.external_urls.spotify,
                        notesData: "The tale is yours to tell",
                        noteIsPublic: false,
                        rating: null,
                        dataSetTime: dt,
                        lastNotifTime: dt
                    }
                    noteRef.set(noteDoc, { merge: true })
                    sendNotification(notifToken, id)
                } else {
                    let updateObj = { dataSetTime: dt }
                    functions.logger.log("NOTE EXISTS FOR USER ");

                    if (dt - noteDoc.data().lastNotifTime > 3600000) {
                        sendNotification(notifToken, id)
                        updateObj.lastNotifTime = dt
                    }

                    // update the item with the last listened to time
                    // also update the last push notif time
                    noteRef.update(updateObj)
                }
            }
        })
    });

// sends a notification to the user 
async function sendNotification(pushToken, noteId) {
  // Create the messages that you want to send to clients
  let messages = [];
  if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
  }
  messages.push({
      to: pushToken,
      sound: 'default',
      body: 'Would you like to take a note for the podcast right now?',
      data: { noteId: noteId },
  })

  let chunks = expo.chunkPushNotifications(messages);
  (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
          try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
          } catch (error) {
              console.error(error);
          }
      }
  })();
}


exports.getPodcastsWithReviews = functions.https.onRequest(async (request, response) => {
    //return "Creating the user doc"
    functions.logger.log("Getting Podcast Function");
    //functions.logger.log(data);

    //get the podcasts
    try {
        var podcastRef = firestore.collection('podcast');
        var snapshot = await podcastRef.get();
        //var documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        //console.log(documents); // This will log an array of documents from the collection
        //response.send(documents)

        var podcastsWithReviews = [];
    
        // Iterate over each podcast document
        for (const doc of snapshot.docs) {
          const podcastId = doc.id;
          const podcastData = doc.data();
          
          // Fetch the reviews subcollection
          const reviewsSnapshot = await firestore.collection(`podcast/${podcastId}/reviews`).get();
          if (reviewsSnapshot.size > 0) {
            // Calculate the average review score
            let sum = 0;
            let count = 0
            reviewsSnapshot.forEach(reviewDoc => {
                console.log(reviewDoc.data())
              if (reviewDoc.data().rating != null) {
                sum += reviewDoc.data().rating;
                count++
              } 
            });
            const avgScore = parseFloat((sum / count).toFixed(1));
            console.log(avgScore)
    
            // Set the avgScore as the review score for the podcast
            podcastData.reviewScore = avgScore;
          } else {
            // Set the review score to null if no reviews are found
            podcastData.reviewScore = null;
          }
    
          // Add the podcast data to the podcastsWithReviews array
          podcastsWithReviews.push({ id: podcastId, ...podcastData });
        }
        
        console.log("Ending")
        console.log(podcastsWithReviews); // This will log an array of documents from the collection with the average review score
        response.send(podcastsWithReviews);
        //return documents;
      } catch (error) {
        console.error('Error fetching documents:', error);
      }

  });

exports.getPodcastPublicNotes = functions.https.onRequest(async (request, response) => {
    
    if (!request.query.podcastID) {
        response.status(400).send('Missing podcastID parameter');
        return;
    }
    let podcastID = request.query.podcastID;
    console.log(podcastID)
    // Get all users
    const usersSnapshot = await firestore.collection('user').get();
    // Initialize an array to store notes for all users
    let allNotes = [];
    try {
        for (var userDoc of usersSnapshot.docs) {
            // Get user's notes with matching podcastID
            console.log("UserDoc with id" + userDoc.id)

            const noteDoc = await firestore.doc(`user/${userDoc.id}/notes/${podcastID}`).get();
            // If notes found, add them to the allNotes array
            if (noteDoc.exists) {
                const note = { id: noteDoc.id, ...noteDoc.data() };
                if (note.noteIsPublic){
                    allNotes.push(note);
                } 
              }
        }
        response.send(allNotes);
    } catch (error) {
    console.error('Error fetching notes:', error);
    response.status(500).send({ error: 'Error fetching notes' });
    }

    });


// testing the login process


// app.get("/restt", (req, res) => {
//   res.status(200).send({data: "some data"});
// });


// let generateRandomString = function(length) {
//   let text = "";
//   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

//   for (let i = 0; i < length; i++) {
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   }
//   return text;
// };


// app.get("/login", function(req, res) {
//   console.log("INSIDE LOGIN");
//   let state = generateRandomString(16);
//   let scope = "user-read-private user-read-email user-read-playback-state";
//   res.cookie(stateKey, state);
//   console.log("Redirecting to spotify");
//   console.log(querystring.stringify({
//     response_type: "code",
//     client_id: client_id,
//     scope: scope,
//     redirect_uri: redirect_uri,
//     state: state
//   }));
//   res.redirect("https://accounts.spotify.com/authorize?" +
//     querystring.stringify({
//       response_type: "code",
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });

// app.get("/callback", function(req, res) {

//   // your application requests refresh and access tokens
//   // after checking the state parameter6
//   console.log("INSIDE CAllback");
//   console.log(req.query);
//   console.log(req.cookies);

//   let code = req.query.code || null;
//   let state = req.query.state || null;
//   let storedState = req.cookies ? req.cookies[stateKey] : null;

//   console.log(code);
//   console.log(state);
//   console.log(storedState);
  

// //   if (state === null || state !== storedState) {
// //     res.redirect("/#" +
// //       querystring.stringify({
// //         error: "state_mismatch"
// //       }));
// //   } else {
//     //res.clearCookie(stateKey);
//     let authOptions = {
//       url: "https://accounts.spotify.com/api/token",
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: "authorization_code"
//       },
//       headers: {
//         "Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64"))
//       },
//       json: true
//     };

//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {

//         let access_token = body.access_token,
//             refresh_token = body.refresh_token;
//         userAccessToken = access_token;

//         let options = {
//           url: "https://api.spotify.com/v1/me",
//           headers: { "Authorization": "Bearer " + access_token },
//           json: true
//         };

//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });

//         // we can also pass the token to the browser to make requests from there
//         res.redirect(pagelink + "/#" +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect(pagelink+ "/#" +
//           querystring.stringify({
//             error: "invalid_token"
//           }));
//       }
//     });
//   }
// );

// app.get("/refresh_token", function(req, res) {

//   // requesting access token from refresh token
//   let refresh_token = req.query.refresh_token;
//   let authOptions = {
//     url: "https://accounts.spotify.com/api/token",
//     headers: { "Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64")) },
//     form: {
//       grant_type: "refresh_token",
//       refresh_token: refresh_token
//     },
//     json: true
//   };

//   request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {
//       let access_token = body.access_token;
//       userAccessToken = access_token;
//       res.send({
//         "access_token": access_token
//       });
//     }
//   });
// });

// /* GET home page. */
// app.get("/", function(req, res, next) {
//   //res.render("login");
//   console.log(path.join(__dirname, "/"));
//   res.sendFile(path.join(__dirname, "/views/login.html"));
// });

// // test to get data from a user
// app.get("/history", async function(req, res) {
//   let options = {
//     url: "https://api.spotify.com/v1/me/player/currently-playing",
//     headers: { "Authorization": "Bearer " + userAccessToken},
//     json: true
//   }
  
//   request.get(options, function(error, response, body) {
//     console.log("GETTING DATA")
//     console.log(body)
  
//   }) 

//   console.log("GETTING DEVICE")
//   console.log(userAccessToken)

// })

// exports.app = functions.https.onRequest(app);
