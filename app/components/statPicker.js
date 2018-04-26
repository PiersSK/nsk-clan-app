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

export default class MetricPicker extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            metrics: []
        }
        this.getMetrics()
    }

    getMetrics(membershipId) {
        return fetch("https://www.bungie.net/Platform/Destiny2/2/Account/4611686018429031117/Stats?groups=1", {
            method: 'GET',
            headers: {
                'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {

            let stats = responseJson["Response"]["mergedAllCharacters"]["results"][this.props.type]["allTime"];
            for(metric in stats) {
                this.setState(prevState => ({
                    metrics = [
                        ...prevState.metrics,
                        metric
                    ]
                }))
            }
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    createPickerItems() {
        return this.state.metrics.map(function(metricValue, i){
            if(!metricRef[this.props.type].includes(metricValue)){ continue };
            return(
                <Picker.Item label={metricRef[this.props.type][metricValue]} value={metricValue} key={i}/>                
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
            <Picker
                selectedValue={this.state.metric}
                style={{ height: 50, width: "50%", color: "white"}}
                onValueChange={(value) => {
                    this.setState({metric: value})
                    this.getClanMembers();
                }}>
                {this.createPickerItems()}
            </Picker>
        );
    }
}