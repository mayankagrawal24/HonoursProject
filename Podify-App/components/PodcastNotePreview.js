import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableHighlightComponent, TouchableOpacity, Image } from 'react-native'
import colours from '../config/colours';
import { AirbnbRating } from 'react-native-ratings';

export default class PodcastNotePreview extends Component {
    render() {
        const imgUrl = this.props.image.constructor === Array ? this.props.image[0].url : this.props.image.url;
        return (
            <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => {this.props.navigation.navigate('Single Note', {rating: this.props.rating, noteData: this.props.noteContent, title: this.props.title, showName: this.props.by})}}
            >
                <View style={styles.itemTop}>
                    <Image style={styles.itemImage} source={{uri: imgUrl}} />

                    <View style={styles.itemTopText}>
                        <Text style={styles.itemContent} numberOfLines={1}> {this.props.noteContent} </Text>
                        {/* <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode={'tail'} > {this.props.title} </Text>
                        <Text style={styles.itemBy} numberOfLines={1}> {this.props.by} </Text> */}
                    </View> 
                </View>

                {/* <Text style={styles.itemContent} numberOfLines={1}> {this.props.noteContent} </Text> */}
                <View style={{ flexDirection: "row", paddingTop: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemBy}>User Rating: </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <AirbnbRating
                    count={5}
                    defaultRating={this.props.rating}
                    size={20}
                    showRating={false}
                    />
                </View>
            </View>
                
            </TouchableOpacity>
        )
    }
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
    }  
});
