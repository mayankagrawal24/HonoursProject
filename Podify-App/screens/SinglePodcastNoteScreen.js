import React, { Component, useState, useEffect, useContext , useRef} from 'react'
import { Text, View, StyleSheet, TextInput, Image , Switch, SafeAreaView , TouchableWithoutFeedback, Keyboard} from 'react-native'
import colours from '../config/colours';
import { FireStore } from '../config/firebase';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import { AirbnbRating } from 'react-native-ratings';

const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
);

export default function SinglePodcastNoteScreen(props) {

    // const [noteText, onChangeText] = useState("");
    const [note, setNote] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const { user } = useContext(AuthenticatedUserContext);
    console.log("LAST SCREEEN");
    //console.log(props)
    // //Switch
    // const [isEnabled, setIsEnabled] = useState(false);
    // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  
    // const [rating, setRating] = useState(0);

    // //const noteTextRef = useRef(noteText);
    // const isEnabledRef = useRef(isEnabled);
    // const ratingRef = useRef(rating);

    const getNote = async () => {
        //just get the variables from the props
        console.log("Inside get Note")
        let note = {
            title: props.route.params.title,
            showName: props.route.params.showName,
            noteText:props.route.params.noteData,
            rating:props.route.params.rating
        }
        setNote(note);
        console.log(note)
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

    // useEffect(() => {
    //     const unsubscribe  = props.navigation.addListener('beforeRemove', async (e) => {
    //         // console.log('leaving');
    //         // console.log('this has: '+noteText);
    //         //Updating info for the note
    //         const uid = user.uid;
    //         var noteRef = FireStore.doc(`user/${uid}/notes/${props.route.params.noteId}`);
    //         // console.log("The rating state: " + rating)
    //         // console.log("The rating ref: " + ratingRef.current)

    //         // console.log("The Privacy State: " + isEnabled)
    //         // console.log("The Privacy ref: " + isEnabledRef.current)

    //         //user ref to get value

    //         console.log("END OF LOG")
    //         noteRef.update({
    //             notesData: noteText,
    //             noteIsPublic: isEnabledRef.current, 
    //             rating: ratingRef.current
    //         });

    //         //Updating info for the review for the podcast

    //         var podcastRef = FireStore.collection(`podcast/${props.route.params.noteId}/reviews`);
    //         var query = podcastRef.where('uid', '==', uid);
    //         var queryResult = await query.get();

    //         if (!queryResult.empty) {
    //             console.log("UPDATING")
    //             var docReviewRef = queryResult.docs[0].ref;
    //             await docReviewRef.update({ rating: ratingRef.current });
    //             console.log("Document successfully updated!");
    //         }
    //         else {
    //             console.log("CREATING")
    //             await podcastRef.add({
    //                 uid: uid,
    //                 rating: ratingRef.current
    //             });
    //             console.log("Document successfully added to podcastRef collection!");
    //         }
    //     });

    //     return () => {
    //         unsubscribe();
    //     }
    // }, [props.navigation, noteText]);

    // useEffect(() => {
    //     isEnabledRef.current = isEnabled;
    // }, [isEnabled]);
    
    // useEffect(() => {
    //     ratingRef.current = rating;
    // }, [rating]);
    
    // var imgUrl = ""
    // if(loaded){
    //     imgUrl = note.image.constructor === Array ? note.image[0].url : note.image.url;
    // }
    return (
        //<Text>IN SINGLE NOTE</Text>
        <View style={styles.mainContainer}>
            {loaded ? (<View style={styles.itemTop}>
                {/* <Image style={styles.itemImage} source={{uri: imgUrl}} /> */}

                <View style={styles.itemTopText}>
                    <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode={'tail'} > {note.title} </Text>
                    <Text style={styles.itemBy} numberOfLines={1}> {note.showName} </Text>
                </View> 
            </View>) : <Text></Text>}

            <View style={{ flexDirection: "row", paddingTop: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemBy}>Your Rating: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <AirbnbRating
                    count={5}
                    defaultRating={props.route.params.rating}
                    size={20}
                    showRating={false}
                    />
                </View>
            </View>

        

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
                //onChangeText={text => {onChangeText(text)}}
                value={props.route.params.noteData}
                style={styles.edit}
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
