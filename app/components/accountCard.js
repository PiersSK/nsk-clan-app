import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet } from 'react-native';

//get styles
import styles from "../styles.js"

export default class AccountCard extends React.Component {
    render() {
        return (
            <View style={[
                styles.infoCard,
                {backgroundColor: this.props.member.isOnline?"rgb(69, 62, 59)":"rgba(69, 62, 59, 0.2)",
                borderColor: this.props.member.isOnline?"rgb(244, 220, 66)":"rgba(244, 220, 66, 0.2)"
                }]}>
                <Text style={styles.memberName}>{this.props.member.destinyUserInfo.displayName}</Text>
                <View style={{padding: 5, backgroundColor: this.props.member.isOnline?"#52af53":"#f44542",}}>
                    <Image
                    style={{width: 50, height: 50}}
                    source={{uri: 'https://www.bungie.net'+this.props.member.bungieNetUserInfo.iconPath}}
                    />
                </View>
            </View>
        )
    }
}