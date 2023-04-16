import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button } from 'react-native';
import { HttpsFunctions } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {AuthSession} from 'expo'
import { FireStore } from '../config/firebase';
import { Text, View, StyleSheet, TextInput, Image , Switch, ScrollView} from 'react-native'
import colours from '../config/colours';
import { useNavigation } from '@react-navigation/native';


const scopes = 'user-read-email user-read-playback-state'
const clientId = '24f12425b4164b78aba2fd10b011fe20';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function SpotifyScreen() {
  const [isSpotifyConnected, setIsSpotifyConnected] = React.useState(false);
  const navigation = useNavigation();
  let redirectLink = makeRedirectUri({scheme: 'exp://'})

  console.log(makeRedirectUri({scheme: 'exp://'}))

  const { user } = React.useContext(AuthenticatedUserContext);

  React.useEffect(async() => {
    const userRef = FireStore.doc(`user/${user.uid}`);
    var userDoc = await userRef.get().catch((error) => {
      functions.logger.log("Firestore user retrieval failed", error);
      throw new functions.https.HttpsError("Firestore user retrieval failed", error);
    });
    console.log("GETTING USER DATA");
    console.log(userDoc.data());
    let userData = userDoc.data();

    if (userData.hasOwnProperty('access_token')){
      console.log("USer has set up spotify");
      setIsSpotifyConnected(true);
    }
    else {
      console.log("User needs to set up access ");
    }

  }, []);

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
      navigation.goBack();
    }
  }, [response]);
  return isSpotifyConnected ? (
    <View style={styles.mainContainer}>
    <View style={styles.notesWrapper}>
        <Text style={styles.mainTitle}>Spotify Connection</Text>
    </View>

    <View style={styles.itemContainer}>
        <ScrollView style={styles.items}>
            <Text style={styles.emptyMessage}>Congratulations Spotify has Already Been Set up!</Text>
        </ScrollView>
    </View>

  </View>
    ) :  (
      <View style={styles.mainContainer}>
        <View style={styles.notesWrapper}>
            <Text style={styles.mainTitle}>Spotify Connection</Text>
        </View>
    
        <View style={styles.itemContainer}>
            <ScrollView style={styles.items}>
                <Button
                  disabled={!request}
                  title="Connect Spotify Account"
                  onPress={() => {
                    promptAsync();
                  }}
                />
            </ScrollView>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  mainContainer: {
      flex: 1,
      backgroundColor: colours.lgrey,
      paddingHorizontal: 20,
      // paddingTop: 50,
  },
  notesWrapper: {
      paddingTop: 20,
  },
  mainTitle: {
      fontSize: 40,
      fontWeight: 'bold',
      color: colours.primary,
  },
  items: {
      paddingTop: 10,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      position: 'absolute',
      paddingBottom: 50,
      paddingTop: 10,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colours.lgrey,
  },
  footerBtn: {
      color: colours.primary,
  },
  itemContainer: {
    paddingTop: 10,
  paddingBottom: 200, 
  },
  emptyMessage: {
    color:'#fff',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20, // Adjust this value to vertically position the message
  }
});

