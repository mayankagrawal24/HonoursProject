import React, { Component, useState, useEffect, useContext } from 'react'
import { Text, View, StyleSheet, TextInput, Image } from 'react-native'
import colours from '../config/colours';
import { FireStore } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

export default function EditScreen(props) {

    const [noteText, onChangeText] = useState("");
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { user } = useContext(AuthenticatedUserContext);

    const getNote = async () => {
        const uid = user.uid;
        var noteRef = FireStore.doc(`user/${uid}/notes/${props.route.params.noteId}`);
        var noteDoc = await noteRef.get().catch((error) => {
            functions.logger.log("Firestore user retrieval failed", error);
            throw new functions.https.HttpsError("Firestore user retrieval failed", error);
        });
        setNote(noteDoc.data());
        onChangeText(noteDoc.data().notesData);
        setLoaded(true);
    }

    useEffect(() => {
        const loadData = async () => {
          await getNote();
        };
        setTimeout(() => {
          loadData();
        }, 1500);
      }, []);

    useEffect(() => {
        props.navigation.addListener('beforeRemove', (e) => {
            // console.log('leaving');
            // console.log('this has: '+noteText);
            const uid = user.uid;
            var noteRef = FireStore.doc(`user/${uid}/notes/${props.route.params.noteId}`);
            noteRef.update({
                notesData: noteText,
            });
        });
    }, [props.navigation, noteText]);
    
    var imgUrl = ""
    if(loaded){
        imgUrl = note.image.constructor === Array ? note.image[0].url : note.image.url;
    }
    return (
        <View style={styles.mainContainer}>
            {loaded ? (<View style={styles.itemTop}>
                <Image style={styles.itemImage} source={{uri: imgUrl}} />

                <View style={styles.itemTopText}>
                    <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode={'tail'} > {note.title} </Text>
                    <Text style={styles.itemBy} numberOfLines={1}> {note.showName} </Text>
                </View> 
            </View>) : <Text></Text>}

            <View
            style={{
                paddingTop: 20,
                borderBottomWidth: 1,
                borderColor: colours.primary,
            }}
            />

            <TextInput
                multiline
                numberOfLines={0}
                onChangeText={text => {onChangeText(text)}}
                value={noteText}
                style={styles.edit}
                editable
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colours.dgrey,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    notesWrapper: {
        paddingTop: 20,
    },
    edit: {
        flex: 1,
        marginTop: 40,
        padding: 10,
        bottom: 20,
        fontSize: 24,
        color: colours.llgrey,
        // backgroundColor: ,
        borderRadius: 5,
    },
    itemTop: {
        flexDirection: 'row',
    },
    itemTopText: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        paddingLeft: 10,
    },
    itemTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'left',
        color: colours.primary,
    },
    itemImage: {
        backgroundColor: 'blue',
        width: 80,
        height: 80,
        borderRadius: 5,
    },
    itemBy: {
        color: colours.llgrey,
    }
});
