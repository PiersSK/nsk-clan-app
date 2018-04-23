import React from 'react';
import  { View, 
          Text,
          ScrollView,
          ActivityIndicator,
          Button
        } from 'react-native';

import StatCard from "../components/statCard.js"

import styles from "../styles.js"

export default class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
        this.getAccountStats();
    }

    getAccountStats() {
        return fetch("https://www.bungie.net/Platform/Destiny2/2/Account/"+this.props.membershipId+"/Stats?groups=1",{
            method: 'GET',
            headers: {
                "x-api-key":"9997abb282fe4698977c1d6391d25c43",
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                mergedStats: responseJson["Response"]["mergedAllCharacters"]["results"],
                isLoading: false
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    generateStatsDisplay() {
        
        
        let stats = this.state.mergedStats
        let pveStats = stats["allPvE"]["allTime"]
        let pvpStats = stats["allPvP"]["allTime"]
        
        return ( 
            <ScrollView>
                <View>
                    <View style={styles.statsBox}>
                        <Text style={styles.subTitle}>PvE</Text>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Kills" value={pveStats["kills"]["basic"]["value"]}/>
                            <StatCard title="Deaths" value={pveStats["deaths"]["basic"]["value"]}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="KDR" value={pveStats["killsDeathsRatio"]["basic"]["value"].toFixed(2)}/>
                            <StatCard title="Efficiency" value={pveStats["efficiency"]["basic"]["value"].toFixed(2)}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Precision Kills" value={pveStats["precisionKills"]["basic"]["value"]}/>
                            <StatCard title="Suicides" value={pveStats["suicides"]["basic"]["value"]}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Best Weapon Type" value={pveStats["weaponBestType"]["basic"]["displayValue"]}/>
                        </View>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={styles.subTitle}>PvP</Text>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Kills" value={pvpStats["kills"]["basic"]["value"]}/>
                            <StatCard title="Deaths" value={pvpStats["deaths"]["basic"]["value"]}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="KDR" value={pvpStats["killsDeathsRatio"]["basic"]["value"].toFixed(2)}/>
                            <StatCard title="Efficiency" value={pvpStats["efficiency"]["basic"]["value"].toFixed(2)}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Precision Kills" value={pvpStats["precisionKills"]["basic"]["value"]}/>
                            <StatCard title="Suicides" value={pvpStats["suicides"]["basic"]["value"]}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Longest Killing Spree" value={pvpStats["longestKillSpree"]["basic"]["value"]}/>
                            <StatCard title="Win %" value={pvpStats["winLossRatio"]["basic"]["value"].toFixed(2)}/>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <StatCard title="Best Weapon Type" value={pvpStats["weaponBestType"]["basic"]["displayValue"]}/>
                        </View>
                    </View>
                </View>
                               
            </ScrollView>
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
                <Text style={styles.subSection}>General Stats</Text>
                {this.generateStatsDisplay()}
            </View>
        )
    }
}