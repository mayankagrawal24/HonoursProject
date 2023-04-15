import React, { Component, useState } from 'react'
import { Text, View, StyleSheet, TouchableHighlightComponent, TouchableOpacity, Image } from 'react-native'
import colours from '../config/colours';
import { Icon } from 'react-native-elements';

export default CommunityNote = (props) => {
        const imgUrl = props.image.constructor === Array ? props.image[0].url : props.image.url;
        const [num, setNum] = useState(props.rando);
        return (
            <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => {props.navigation.navigate('Podcast Notes', { podcastId: props.noteId })}}
            >
                <View style={styles.itemTop}>
                    <Image style={styles.itemImage} source={{uri: imgUrl}} />

                    <View style={styles.itemTopText}>
                        <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode={'tail'} > {props.title} </Text>
                        <Text style={styles.itemBy} numberOfLines={1}> {props.by} </Text>
                    </View> 
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.itemContent} numberOfLines={1}> {props.noteContent ? props.noteContent : '            '} </Text>
                    <View style={styles.avgScoreContainer}>
                        <Text style={styles.avgScore} numberOfLines={1}> {props.avgScore ? "User Ratings: " + props.avgScore + "/5" : '            '} </Text>
                    </View>
                    

                </View>
            </TouchableOpacity>
        )
    }

const styles = StyleSheet.create({
    itemContainer: {
        backgroundColor: colours.dgrey,
        padding: 10,
        borderRadius: 10,
        marginTop: 15,
        borderBottomColor: colours.primary,
        borderBottomWidth: 3,
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        color: colours.primary,
    },
    itemBy: {
        color: colours.primary,
    },
    itemImage: {
        backgroundColor: 'blue',
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    itemContent: {
        fontSize: 16,
        color: 'grey',
        paddingTop: 5,
        color: colours.llgrey,
    },
    bottom: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    thumbs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    avgScoreContainer: {
        paddingHorizontal: 5,
    },
    avgScore: {
        fontSize: 20, // Set font size bigger
        fontWeight: 'bold', // Set font weight to bold
        color: colours.primary,
    },
});
