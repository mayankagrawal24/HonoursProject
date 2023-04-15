import { StatusBar } from 'expo-status-bar';
// import React, { useContext } from 'react';
// import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, AppState } from 'react-native'

import { IconButton } from '../components';
// import { Button } from 'react-native'; 
import { Firebase, FireStore } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import Note from '../components/Note'
import colours from '../config/colours';

const auth = Firebase.auth();

export default function HomeScreen(props) {
  const { user } = useContext(AuthenticatedUserContext);
  const [notes, setNotes] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener('change', () =>{
        console.log("app state changed");
        getNotes();
    });
  }, []);


  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  const getNotes = async () => {
    noteArray = [];
    const uid = user.uid
    var notesRef = FireStore.collection(`user/${uid}/notes`).orderBy('dataSetTime', 'desc');
    var notesDocs = await notesRef.get().catch((error) => {
        console.log(error)
        
        // functions.logger.log("Firestore user retrieval failed", error);
        // throw new functions.https.HttpsError("Firestore user retrieval failed", error);
    });
    // return userDoc;
    notesDocs.forEach(async (noteDoc) => {
        let note = noteDoc.data();
        // console.log(note);
        noteArray.push(
        <Note
            key={note.id}
            title={note.title}
            by={note.showName}
            noteContent={note.notesData}
            image={note.image}
            noteId={note.id}
            navigation={props.navigation}
        />);
    });
    setNotes(noteArray);
    setIsEmpty(noteArray.length === 0);
    setLoaded(true);
  }

  // useEffect(() => {
  //     const unsubscribe = props.navigation.addListener('focus', () => {
  //         getNotes();
  //       });
  //     return unsubscribe;
  //   }, [props.navigation]);

    useFocusEffect(
      React.useCallback(() => {
        const getNotesAndSetState = async () => {
          await getNotes();
        };
    
        getNotesAndSetState();
      }, [])
    );

    return (
      // <View style={styles.container}>
      //   <StatusBar style='dark-content' />
      //   <View style={styles.row}>
      //     <Text style={styles.title}>Welcome {user.email}!</Text>
      //     <IconButton
      //       name='logout'
      //       size={24}
      //       color='#fff'
      //       onPress={handleSignOut}
      //     />
      //   </View>
      //   <Text style={styles.text}>Your UID is: {user.uid} </Text>

      //   <View style={styles.footer}>
      //             {/* <Button title="Check login" onPress={() => {console.log(user)}}/> */}
      //             <Button style={styles.footerBtn} title="Spotify" onPress={() => {props.navigation.navigate('Spotify')}}/>
      //         </View>
      // </View>

      <View style={styles.mainContainer}>
        <View style={styles.notesWrapper}>
            <Text style={styles.mainTitle}>Podify</Text>
        </View>

        <View style={styles.itemContainer}>
            <ScrollView style={styles.items}>
                {/* This is where notes will go */}
                {loaded ? (isEmpty ? <Text style={styles.emptyMessage}>Start Listening to Podcasts for Them To Appear!</Text> : notes) : <Text>Loading</Text>}
            </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button style={styles.footerBtn} title="Sign out" onPress={handleSignOut}/>
            {/* <Button title="Check login" onPress={() => {console.log(user)}}/> */}
            <Button style={styles.footerBtn} title="Spotify" onPress={() => {props.navigation.navigate('Spotify')}}/>
            <Button style={styles.footerBtn} title="Community" onPress={() => {props.navigation.navigate('Community')}}/>
            {/*<Button style={styles.footerBtn} title="Notification System" onPress={() => {props.navigation.navigate('Notification System')}}/> */}
        </View>
      </View>

      
    );
  }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e93b81',
//     paddingTop: 50,
//     paddingHorizontal: 12
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#fff'
//   },
//   text: {
//     fontSize: 16,
//     fontWeight: 'normal',
//     color: '#fff'
//   }
// });

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