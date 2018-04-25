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
            memberKDRs: [],
            errors: 0
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

            this.setState({
                memberJson: responseJson['Response']['results'],
                memberIdList: memberIdList,
                isLoading: false
            })

            for(member in memberIdList) {
                this.getKDR(memberIdList[member]);
            }
            
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
            let numberOfMembers = this.state.memberIdList.length, memberKDR;

            if(responseJson['ErrorCode'] == 1) {
                memberKDR = responseJson["Response"]["mergedAllCharacters"]["results"]["allPvP"]["allTime"]["killsDeathsRatio"]["basic"]["value"];

                this.setState(prevState => ({
                    memberKDRs: {
                        ...prevState.memberKDRs,
                        [membershipId]: memberKDR
                    }
                }))
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    createLeaderboard() {
        let leaderBoard = [], playerName, memberInfoList = this.state.memberJson;
        for (var member in this.state.memberKDRs) {
            leaderBoard.push([member, this.state.memberKDRs[member]]);
        }

        leaderBoard.sort(function(a, b) {
            return b[1] - a[1];
        });
        
        return leaderBoard.map(function(member, i){ 
            for(memberInfo in memberInfoList){
                if(memberInfoList[memberInfo]['destinyUserInfo']["membershipId"] == member[0]) {
                    playerName = memberInfoList[memberInfo]['destinyUserInfo']['displayName'];
                    break;
                }
            }
            return(
                <View style={{backgroundColor:"gray", flexDirection: "row", margin: 5, padding: 5}}>
                    <Text style={{color: "white", fontWeight: "bold"}}>{i+1} </Text>
                    <Text style={{fontWeight: "bold"}}>{playerName} </Text>
                    <Text>{Number(member[1]).toFixed(2)}</Text>
                </View>
            );
        })
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
                        {this.createLeaderboard()}
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}