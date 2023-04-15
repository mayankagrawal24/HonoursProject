import React, { useContext, useState, useEffect, useRef } from 'react'
import { Text, View, ScrollView, StyleSheet, Button, AppState } from 'react-native'
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { Firebase, FireStore } from '../config/firebase';
import colours from '../config/colours';
import PodcastNotePreview from '../components/PodcastNotePreview';

const auth = Firebase.auth();

export default function PodcastNotesScreen(props) {
    const { user } = useContext(AuthenticatedUserContext);
    console.log("notes screen");
    console.log(props);
    console.log(props.route.params.podcastId);
    const podcastId = props.route.params.podcastId;

    const [notes, setNotes] = useState(null);
    const [loaded, setLoaded] = useState(false);
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
        // var notesRef = FireStore.collection(`user/${uid}/notes`).orderBy('dataSetTime', 'asc');
        // var notesDocs = await notesRef.get().catch((error) => {
        //     functions.logger.log("Firestore user retrieval failed", error);
        //     throw new functions.https.HttpsError("Firestore user retrieval failed", error);
        // });
        // return userDoc;
        var dummy = 14;
        const response = await fetch(`https://us-central1-honours-project-24ce1.cloudfunctions.net/getPodcastPublicNotes?podcastID=${podcastId}`);
        const notesDocs = await response.json();

        console.log(notesDocs)
        notesDocs.forEach(async (noteDoc) => {
            let note = noteDoc;
            // console.log(note);
            noteArray.push(
            <PodcastNotePreview
                key={note.id}
                title={note.title}
                by={note.showName}
                noteContent={note.notesData}
                image={note.image}
                noteId={note.id}
                navigation={props.navigation}
                rating={note.rating}
            />);
        });
        setNotes(noteArray);
        setLoaded(true);
    }

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getNotes();
          });
        return unsubscribe;
      }, [props.navigation]);

    return (
        // <View style={styles.mainContainer}>
        //     <Text>PODCAST NOTES SCREEN</Text>
        // </View>
        <View style={styles.mainContainer}>
        <View style={styles.notesWrapper}>
            <Text style={styles.mainTitle}>Notes for podcast </Text>
        </View>

        <View style={styles.itemContainer}>
            <ScrollView style={styles.items}>
                {/* This is where notes will go */}
                {loaded ? notes : <Text>Loading</Text>}
            </ScrollView>
        </View>

        <View style={styles.footer}>
            <Button style={styles.footerBtn} title="Sign out" onPress={handleSignOut}/>
            {/* <Button title="Check login" onPress={() => {console.log(user)}}/> */}
            <Button style={styles.footerBtn} title="Spotify" onPress={() => {props.navigation.navigate('Spotify')}}/>
            <Button style={styles.footerBtn} title="Notif" onPress={() => {props.navigation.navigate('Notif')}}/>
        </View>
        </View>
    )
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
        fontSize: 24,
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
    }
});
