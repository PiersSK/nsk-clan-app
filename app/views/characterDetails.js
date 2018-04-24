import React from 'react';
import {
    ActivityIndicator,
    Text,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    ImageBackground,
    StyleSheet } from 'react-native';
import { Navigation } from 'react-navigation';

//get components
import CharacterCard from "../components/characterCard.js"
import Stats from "../components/stats.js"
import PGCR from "../components/activity.js"

//get styles
import styles from "../styles.js"

export default class CharacterDetailsScreen extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={ isLoading: true, error: false}
    }
    
    static navigationOptions = ({ navigation }) => ({ //set the nav bar that opens
        title: `${navigation.state.params.class}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center',color:"rgb(244, 220, 66)"},
        headerStyle:{
            backgroundColor:'gray',
        },
    });
    
    render() {
        // if(this.state.isLoading){
        //     return(
        //         <View style={{flex: 1, padding: 23}}>
        //         <ActivityIndicator/>
        //         </View>
        //     )
        // }
    
        return(
            <View style={[StyleSheet.absoluteFill]}>
                <ImageBackground
                    source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}}   
                    style={{width: "100%", height: "100%"}} 
                    >
                    <ScrollView style={{paddingTop: 5}}>
                        <CharacterCard character={this.props.navigation.state.params.character}/>
                        <PGCR membershipId={this.props.navigation.state.params.membershipId} characterId={this.props.navigation.state.params.character.characterId}/> 
                        <Stats membershipId={this.props.navigation.state.params.membershipId} characterId={this.props.navigation.state.params.character.characterId}/>
                    </ScrollView>
                </ImageBackground>
            </View>
        )
    }
}