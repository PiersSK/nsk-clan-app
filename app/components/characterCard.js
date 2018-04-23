import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet } from 'react-native';

//get styles
import styles from "../styles.js"

export default class CharacterCard extends React.Component {
    render() {
        const classRef = {
            "0": "Titan",
            "1": "Hunter",
            "2": "Warlock",
        }, hoursPlayed = ((this.props.character.minutesPlayedTotal-this.props.character.minutesPlayedTotal%60)/60) + "h " + this.props.character.minutesPlayedTotal%60 + "m"

        return (
            <View style={[styles.characterCard, styles.infoCard]}>
                <View>
                    <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>{classRef[this.props.character.classType]}</Text>
                    <Text style={{color:"cyan", fontSize:16, fontWeight:"bold"}}>* {this.props.character.light}</Text>
                    <Text style={{color:"orange", fontSize:14, fontStyle:"italic"}}>Hours Played: {hoursPlayed}</Text>
                </View>
                <Image
                    style={{width: 50, height: 50}}
                    source={{uri: 'https://www.bungie.net'+this.props.character.emblemPath}}
                />
            </View>
        )
    }
}