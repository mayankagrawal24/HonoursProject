import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableHighlightComponent, TouchableOpacity, Image } from 'react-native'
import colours from '../config/colours';

export default class Note extends Component {
    render() {
        const imgUrl = this.props.image.constructor === Array ? this.props.image[0].url : this.props.image.url;

        return (
            <TouchableOpacity 
                style={styles.itemContainer}
                onPress={() => {this.props.navigation.navigate('Edit', { noteId: this.props.noteId })}}
            >
                <View style={styles.itemTop}>
                    <Image style={styles.itemImage} source={{uri: imgUrl}} />

                    <View style={styles.itemTopText}>
                        <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode={'tail'} > {this.props.title} </Text>
                        <Text style={styles.itemBy} numberOfLines={1}> {this.props.by} </Text>
                    </View> 
                </View>

                <Text style={styles.itemContent} numberOfLines={1}> {this.props.noteContent} </Text>
                
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
