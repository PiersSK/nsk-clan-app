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

export default class CharacterScreen extends React.Component {
    
    constructor(props){
        super(props);
        this.state ={ isLoading: true, error: false}
        this.getCharacterIds();
    }
    
    static navigationOptions = ({ navigation }) => ({ //set the nav bar that opens
        title: `${navigation.state.params.playerName}`,
        headerTitleStyle : {textAlign: 'center',alignSelf:'center',color:"rgb(244, 220, 66)"},
        headerStyle:{
            backgroundColor:'gray',
        },
    });
    
    getCharacterIds() { //get a list of the members characters
        return fetch("https://www.bungie.net/platform/Destiny2/2/Profile/"+this.props.navigation.state.params.membershipId+"?components=200", {
            method: 'GET',
            headers: {
                'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson['ErrorCode'] != "1"){ //if call was successful but response was error
                this.setState({
                    error: JSON.stringify(responseJson, null, 2)
                })
            } else {
                this.setState({
                    characters: responseJson["Response"]["characters"]["data"],
                    isLoading: false, //only request the page is waiting on
                })
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    
    makeCharacterCards() { 
    
        if(this.state.error){ //just print error JSON if no characters were returned
            return(
                <Text style={{color:"red"}}>{this.state.error}</Text>
            )
        };
    
        const { navigate } = this.props.navigation;
        const classRef = {
            "0": "Titan",
            "1": "Hunter",
            "2": "Warlock",
        };
    
        let membershipId = this.props.navigation.state.params.membershipId;
        let characters = this.state.characters;

        let characterList = []
        for(character in characters) { //object to array for simplicity 
            characterList.push(characters[character])
        }
    
        return characterList.map(function(character, i){ //create character cards for each of a memberes created characters
            return(
                <TouchableHighlight
                    onPress={() => navigate("CharacterDetails", {
                        membershipId: membershipId,
                        character: character,
                        class: classRef[character.classType]
                    })}
                    underlayColor={"transparent"}
                    key={i} >
                    <CharacterCard character={character} key={i}/>
                </TouchableHighlight>
            );
        })
        
    }
    
    render() {
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, padding: 23}}>
                <ActivityIndicator/>
                </View>
            )
        }
    
        return(
            <View style={[StyleSheet.absoluteFill]}>
                <ImageBackground
                    source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}}   
                    style={{width: "100%", height: "100%"}} 
                    >
                    <ScrollView style={{paddingTop: 5}}>
                        {this.makeCharacterCards()}
                        {/* <Text>{JSON.stringify(this.state.characters, null, 2)}</Text> */}
                        <Stats membershipId={this.props.navigation.state.params.membershipId} characterId={false}/>
                        {/* <PGCR membershipId={this.props.navigation.state.params.membershipId} characterId={"2305843009262356386"}/>  */}
                    </ScrollView>
                </ImageBackground>
            </View>
        )
    }
}