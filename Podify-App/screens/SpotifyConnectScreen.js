import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';
import { HttpsFunctions } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {AuthSession} from 'expo'
const scopes = 'user-read-email user-read-playback-state'
const clientId = '24f12425b4164b78aba2fd10b011fe20';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function SpotifyScreen() {
  
  let redirectLink = makeRedirectUri({scheme: 'exp://'})

  console.log(makeRedirectUri({scheme: 'exp://'}))

  const { user } = React.useContext(AuthenticatedUserContext);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: ['user-read-email', 'user-read-playback-state', 'playlist-modify-public'],
      redirectUri: redirectLink,
      usePKCE: false,
    },
    discovery
  );

  React.useEffect(() => {
    console.log("INMSDIEEDD")
    console.log(response)
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log(code)
      let connectSpotifyToApplication = HttpsFunctions.httpsCallable('createUserDoc');
      const result = connectSpotifyToApplication({ code: code }).catch((error) => {
        console.log(error);
      });
      console.log('this is a user' + user.uid);
      console.log('this is the response' + response);

    }
  }, [response]);
  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}



