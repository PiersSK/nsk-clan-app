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


//get styles
import styles from "../styles.js"

export default class LeaderboardScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            memberKDRs: {}
        }
        this.getClanMembers();
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
            let memberIdList = [];
            for(member in responseJson['Response']['results']) {
                memberIdList.push(responseJson['Response']['results'][member]["destinyUserInfo"]["membershipId"]);
            }

            for(member in memberIdList) {
                this.getKDR(memberIdList[member]);
            }
            
        })
        .then(() => {
            this.setState({
                isLoading: false
            })
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    getKDR(membershipId) {
        return fetch("https://www.bungie.net/Platform/Destiny2/2/Account/"+membershipId+"/Stats?groups=1", {
            method: 'GET',
            headers: {
                'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let memberKDR = responseJson["Response"]["mergedAllCharacters"]["results"]["allPvP"]["killsDeathsRatio"]["basic"]["value"];
            this.setState(prevState => ({
                memberKDRs: {
                    ...prevState.memberKDRs,
                    membershipId: memberKDR
                }
            }))
        })
        .catch((error) =>{
            console.error(error);
        });
    }
    render(){

        if(this.state.isLoading){
            return(
            <View style={{flex: 1, padding: 23}}>
                <ActivityIndicator/>
            </View>
            )
        }

        return(
            <View style={[StyleSheet.absoluteFill, {paddingTop:23}]}>
                <ImageBackground
                source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}} //a pretty destiny map background image
                style={{width: "100%", height: "100%"}} 
                >
                    <ScrollView style={{paddingTop: 5}}>
                        <Text>{JSON.stringify(this.state.memberKDRs, null, 2)}</Text>
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}