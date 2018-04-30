import React from 'react';
import  { View, 
          Text,
          ScrollView,
          ActivityIndicator,
          Button
        } from 'react-native';

import StatCard from "./statCard.js"
import ActivityCard from "./activityHead.js"

import styles from "../styles.js"

export default class PGCR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.getLastActivity();
    }

    getLastActivity() {
        return fetch("https://www.bungie.net/Platform/Destiny2/2/Account/"+this.props.membershipId+"/Character/"+this.props.characterId+"/Stats/Activities",{
            method: 'GET',
            headers: {
                "x-api-key":"9997abb282fe4698977c1d6391d25c43",
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let activityId = "";

            for(activity in responseJson["Response"]["activities"]){
                if(responseJson["Response"]["activities"][activity]['activityDetails']['mode'] != 6){ //get most recent non-patrol activity
                    activityId = responseJson["Response"]["activities"][activity]['activityDetails']['instanceId'];
                    break;
                }
            }

            this.setState({
                activityId: activityId,
            })
            this.getPGCR();
        })
        .catch((error) => {
            console.error(error);
        });
    }

    getPGCR() {
        return fetch("https://www.bungie.net/Platform/Destiny2/Stats/PostGameCarnageReport/"+this.state.activityId, {
            method: 'GET',
            headers: {
                "x-api-key":"9997abb282fe4698977c1d6391d25c43",
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            let playerStats = "test";
            for(player in responseJson["Response"]['entries']){
                if(responseJson["Response"]['entries'][player]['player']['destinyUserInfo']['membershipId'] == this.props.membershipId){
                    playerStats = responseJson["Response"]['entries'][player]['values'];
                    break;
                }
            }
            this.setState({
                activityInfo: responseJson["Response"]['activityDetails'],
                activityStats: playerStats,
                isLoading: false
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    makePGCRDisplay() {
        let stats = this.state.activityStats;

        return (
            <View>
                <View style={styles.statsBox}>
                    <Text style={styles.subTitle}>Most Recent Activity</Text>
                        <ActivityCard activity={this.state.activityInfo}/>
                    <View style={{flexDirection:"row"}}>
                        <StatCard title="Kills" value={stats["kills"]["basic"]["value"]}/>
                        <StatCard title="Assists" value={stats["assists"]["basic"]["value"]}/>
                        <StatCard title="Deaths" value={stats["deaths"]["basic"]["value"]}/>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <StatCard title="KDR" value={stats["killsDeathsRatio"]["basic"]["value"].toFixed(2)}/>
                        <StatCard title="Efficiency" value={stats["efficiency"]["basic"]["value"].toFixed(2)}/>
                    </View>
                </View>
            </View>
        )
    }

    render() {

        if(this.state.isLoading){
            return (
                <View style={{padding:50}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <View>
                <Text style={styles.subSection}>PGCR</Text>
                {this.makePGCRDisplay()}
                {/* <Text style={{color:"white"}}>{JSON.stringify(this.state.activityStats,null,2)}</Text> */}
                {/* <Text style={{color:"gray"}}>{JSON.stringify(this.state.check,null,2)}</Text> */}
                {/* <Text style={{color:"white"}}>{this.state.activityId}</Text> */}
            </View>
        )
    }
}