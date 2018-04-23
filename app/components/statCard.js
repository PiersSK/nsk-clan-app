import React from 'react';
import  { View, 
          Text,
        } from 'react-native';

import styles from "../styles.js"

export default class StatCard extends React.Component {
    render() {
        return (
            <View style={[styles.infoCard, styles.characterCard,{flex:1}]}>
                <Text style={{fontWeight:"bold", color: "#efb20b"}}>{this.props.title}</Text>
                <Text style={{color: "white"}}>{this.props.value}</Text>
            </View>
        )
    }
}