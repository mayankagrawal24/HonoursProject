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
  
  //rconsole.log(AuthSession.getRedirectUrl())

  const { user } = React.useContext(AuthenticatedUserContext);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: clientId,
      scopes: ['user-read-email', 'user-read-playback-state'],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      show_dialog: true,
      redirectUri: makeRedirectUri({
        scheme: 'Podify'
      }),
    },
    discovery
  );

  React.useEffect(() => {
    //console.log(response)
    console.log("INMSDIEEDD")
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('this is a user' + user.uid);
      console.log('this is the response' + response);

    //   var authenticateSpotifyCode = HttpsFunctions.httpsCallable('authenticate');
    //   const result = authenticateSpotifyCode({ code: code }).catch((error) => {
    //     console.log(error);
    //   });
    // console.log(result.data)
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



