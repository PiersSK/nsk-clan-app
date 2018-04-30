import React from 'react';
import  { View, 
          Text,
          ImageBackground,
          Image
        } from 'react-native';

import styles from "../styles.js"

export default class ActivityCard extends React.Component {

    constructor(props){
        super(props);
        this.state ={ isLoading: true }
        this.getActivityDetails();
    }
    
    getActivityDetails() { //get a list of the members characters
        return fetch("https://www.bungie.net/Platform/Destiny2/Manifest/DestinyActivityDefinition/"+this.props.activity.referenceId, {
            method: 'GET',
            headers: {
                'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                data: responseJson['Response'],
                isLoading: false, //only request the page is waiting on
            })
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    displayAdvanceDetails() {
        if(typeof this.state.data === "undefined") {
            return(
                <Text></Text>
            )
        }
        return(
            <Text style={{fontWeight:"bold", color: "rgba(255,255,255,0.8)", fontSize: 18}}>{this.state.data['displayProperties']['name']}</Text>
        )
    }

    render() {

        let modeRef = {
            detailed: {
                15: "Crimson Doubles",
                17: "Prestigue Nightfall",
                18: "Strike Playlist",
                41: "Trials of the Nine - Countdown",
                42: "Trials of the Nine - Survival",
                43: "Iron Banner - Control",
                44: "Iron Banner - Clash",
                45: "Iron Banner - Supremacy",
                46: "Nightfall (Scored)",
                47: "Prestigue Nightfall (Scored)",
                49: "Doubles Playlist"
            },
            general: {
                2: "Story",
                3: "Strike",
                4: "Raid",
                10: "Control",
                12: "Clash",
                16: "Nightfall",
                19: "Iron Banner",
                31: "Supremacy",
                37: "Survival",
                38: "Countdown",
                39: "Trials of the Nine",
                48: "Rumble",
                50: "Doubles"
            },
            basic: {
                5: "PvP",
                7: "PvE",
                40: "Social"
            }
        }, title = false, type;

        for(ref in modeRef){
            for(modeKey in modeRef[ref]){
                if(this.props.activity.modes.includes(Number(modeKey))) {
                    title = modeRef[ref][modeKey];
                    break
                }
            }
            if(title){ break };
        }

        for(typeKey in modeRef['basic']){
            if(this.props.activity.modes.includes(Number(typeKey))) {
                type = modeRef['basic'][typeKey]
                break;
            }
        }

        let bgImage = typeof this.state.data === "undefined" ? "https://alphalupi.bungie.net/images/background.jpg" : "https://www.bungie.net" + this.state.data['pgcrImage'];
        let actvityImage = typeof this.state.data === "undefined" ? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP" : "https://www.bungie.net" + this.state.data['displayProperties']['icon'];
        

        let backgroundColor = title.split(" - ")[0].toLowerCase()=="trials of the nine"?"#57d6cb":type=='PvE'?"#221c44":"#6d1b12"

        if(this.state.isLoading) {
            <View style={[styles.infoCard, styles.characterCard,{flex:1, backgroundColor:backgroundColor}]}>
                <Text style={{fontWeight:"bold", color: "white"}}>{title}</Text>
                <Text style={{color: "rgba(255,255,255,0.5)", fontWeight: "bold", fontSize: 10}}>{type}</Text>
            </View>
        }

        return (
            <View style={[styles.infoCard, styles.characterCard,{flex:1, backgroundColor:backgroundColor, padding: 0, borderColor:"transparent"}]}>
                <ImageBackground
                    source={{uri: bgImage}}   
                    style={{width: "100%", height: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}
                    blurRadius={1}
                    >
                    <View style={{padding: 10}}>
                        <Text style={{fontWeight:"bold", color: "white", fontSize: 18}}>{title}</Text>
                        {this.displayAdvanceDetails()}
                        <Text style={{color: "rgba(255,255,255,1)", fontWeight: "bold", fontSize: 10}}>{type}</Text>
                    </View>
                    <View>
                        <Image
                        style={{width: 50, height: 50, marginRight: 10}}
                        source={{uri: actvityImage}}
                        />
                    </View>
                </ImageBackground>
            </View>
        )
    }
}