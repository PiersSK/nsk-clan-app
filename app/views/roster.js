import React from 'react';
import {
    ActivityIndicator,
    Text,
    View,
    ScrollView,
    Image,
    TouchableHighlight,
    ImageBackground,
    StyleSheet, 
    StatusBar} from 'react-native';
import { Navigation } from 'react-navigation';

//get components
import AccountCard from "../components/accountCard.js"

//get styles
import styles from "../styles.js"

export default class RosterScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={ isLoading: true}
        this.getClanMembers()
    }

    getClanMembers() { //gets a list of clan members - primarily for getting their membershipId number
        return fetch("https://www.bungie.net/platform/GroupV2/1159135/members/", {
            method: 'GET',
            headers: {
                'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                memberInfo: responseJson['Response']['results'],
                isLoading: false //this will be the only thing the page is waiting on
            })
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    makeAccountCards() {
        let memberList = this.state.memberInfo.sort((x, y) => { //put the online players to the top of the list
            return x.isOnline ? -1 : y.isOnline ? 1 : 0;
        })

        const { navigate } = this.props.navigation //fixes some issues with the onPress func having access to navigate()

        return memberList.map(function(member, i){ //creates a touchable card for each player
            if(!member.hasOwnProperty("bungieNetUserInfo")){ //if they don't have a bungie.net account, give them the default avatar
                member["bungieNetUserInfo"] = {iconPath: "/img/profile/avatars/default_avatar.gif"}
            }
            return(
                <TouchableHighlight
                    onPress={() => navigate("Characters", {membershipId: member.destinyUserInfo.membershipId, playerName: member.destinyUserInfo.displayName})}
                    underlayColor={"transparent"}
                    key={i} >
                    <AccountCard member={member}/>
                </TouchableHighlight>
            );
        })
    
    }

    render(){

        if(this.state.isLoading){
            return(
                <ImageBackground
                    source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}}   
                    style={[StyleSheet.absoluteFill, {width: "100%", height: "100%", padding: 50}]} 
                    >
                    <ActivityIndicator/>
                </ImageBackground>
            )
        }

        return(
            <View style={[StyleSheet.absoluteFill]}>
                <ImageBackground
                source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}} //a pretty destiny map background image
                style={{width: "100%", height: "100%"}} 
                >
                    {/* <StatusBar
                        backgroundColor="blue"
                        barStyle="light-content"
                    /> */}
                    <ScrollView style={{paddingTop: 5}}>
                        {this.makeAccountCards()}
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}