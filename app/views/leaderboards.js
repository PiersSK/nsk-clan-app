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
    Picker } from 'react-native';
import { Navigation } from 'react-navigation';


//get styles
import styles from "../styles.js"
import metricRef from "../references/statTitles.js"

export default class LeaderboardScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            leaderBoardLoading: true,
            memberKDRs: [],
            check: [],
            metric: "killsDeathsRatio",
            type: "allPvP",
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
                numberOfMembers: memberIdList.length,
                memberKDRs: [],
                isLoading: false,
                leaderBoardLoading: true,
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
            let leaderBoardLoading = !((Object.keys(this.state.memberKDRs).length + 1) == this.state.numberOfMembers), memberKDR;
            let check = this.state.check;
            check.push(responseJson['ErrorCode'] + ", ");

            if(responseJson['ErrorCode'] == 1) {
                memberKDR = responseJson["Response"]["mergedAllCharacters"]["results"][this.state.type]["allTime"][this.state.metric]["basic"]["value"];
                if(this.state.metric == "secondsPlayed"){
                    memberKDR = (memberKDR/3600).toFixed(2)
                }

                this.setState(prevState => ({
                    memberKDRs: {
                        ...prevState.memberKDRs,
                        [membershipId]: memberKDR
                    },
                    leaderBoardLoading: leaderBoardLoading,
                    check: check
                }))
            } else {
                let numberOfMembers = this.state.numberOfMembers - 1;

                this.setState({
                    numberOfMembers: numberOfMembers,
                    leaderBoardLoading: leaderBoardLoading,
                    check: check
                })
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

        if(this.state.leaderBoardLoading){
            return (
                <View style={{flex: 1, padding: 50}}>
                    <ActivityIndicator/>
                    <Text style={{color:"white",fontWeight:"bold",textAlign:"center"}}>
                        Getting player data... {Object.keys(this.state.memberKDRs).length}/{this.state.numberOfMembers}
                    </Text>
                </View>
            )
        }
        
        return leaderBoard.map(function(member, i){ 
            for(memberInfo in memberInfoList){
                if(memberInfoList[memberInfo]['destinyUserInfo']["membershipId"] == member[0]) {
                    playerName = memberInfoList[memberInfo]['destinyUserInfo']['displayName'];
                    break;
                }
            }
            return(
                <View style={[styles.characterCard, styles.infoCard, {margin: 5, padding: 10}]} key={i}>
                    <View style={{flex: 1}}>
                        <Text style={{color: "white", fontWeight: "bold", fontSize:20, textAlign: "center"}}>{i+1} </Text>
                    </View>
                    <View style={{flex: 9, flexDirection: "row", justifyContent: "space-between"}}>
                        <Text style={{fontWeight: "bold", fontSize: 18, color: "#efb20b"}}>{playerName} </Text>
                        <Text style={{color: "white"}}>{Number(member[1]).toFixed(2)}</Text>
                    </View>
                </View>
            );
        })
    }

    createPickerItems() {
        let type = this.state.type
        return Object.keys(metricRef[type]).map(function(metricValue, i){
            return(
                <Picker.Item label={metricRef[type][metricValue]} value={metricValue} key={i}/>                
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
                    <View style={{paddingLeft: 10, paddingRight: 10, backgroundColor: "#050f21" }}>
                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <Picker
                                selectedValue={this.state.type}
                                style={{ height: 50, width: 100, color: "white"}}
                                onValueChange={(value) => {
                                    this.setState({type: value})
                                    this.getClanMembers();
                                }}>
                                <Picker.Item label={"PvP"} value={"allPvP"} key={0}/>
                                <Picker.Item label={"PvE"} value={"allPvE"} key={1}/>
                            </Picker>
                            <Picker
                                selectedValue={this.state.metric}
                                style={{ height: 50, width: 250, color: "white"}}
                                onValueChange={(value) => {
                                    this.setState({metric: value})
                                    this.getClanMembers();
                                }}>
                                {this.createPickerItems()}
                            </Picker>
                            
                        </View>
                    </View>
                    <ScrollView style={{paddingTop: 5}}>
                        {this.createLeaderboard()}
                    </ScrollView>
                </ImageBackground>
            </View>
        );
    }
}