import React from 'react';
import  { View, 
          Text,
        } from 'react-native';

import styles from "../styles.js"

export default class ActivityCard extends React.Component {

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

        let backgroundColor = title.split(" - ")[0].toLowerCase()=="trials of the nine"?"#57d6cb":type=='PvE'?"#221c44":"#6d1b12"

        return (
            <View style={[styles.infoCard, styles.characterCard,{flex:1, backgroundColor:backgroundColor}]}>
                <Text style={{fontWeight:"bold", color: "white"}}>{title}</Text>
                <Text style={{color: "rgba(255,255,255,0.5)", fontWeight: "bold", fontSize: 10}}>{type}</Text>
            </View>
        )
    }
}