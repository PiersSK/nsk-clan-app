/////////////////////SCRAPPED/////////////////////

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

//get styles
import styles from "../styles.js"

export default class CharacterDetailsScreen extends React.Component{
    
      constructor(props){
        super(props);
        this.state ={
          isLoading: true,
          error: false,
          membershipId: this.props.navigation.state.params.membershipId,
          charactedId: this.props.navigation.state.params.characterId,
          itemRef: {},
          test: ""
        }
      }
    
      getWeaponInfo = (hashId) => {
        return fetch("https://www.bungie.net/platform/Destiny2/Manifest/DestinyInventoryItemDefinition/"+hashId, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
          },
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['ErrorCode'] != "1"){
              this.setState({
                error: "https://www.bungie.net/platform/Destiny2/Manifest/DestinyInventoryItemDefinition/"+hashId
              })
            } else {
              this.setState(prevState => ({
                itemRef: {
                  ...prevState.itemRef,
                  hashId: {
                    name: responseJson['Response']['displayProperties']['name']
                  }
                }
              }))
            }
          })
          .catch((error) =>{
            console.error(error);
          });
      }
    
      getUniqueWeaponStats() {
        return fetch("https://www.bungie.net/Platform/Destiny2/2/Account/"+this.state.membershipId+"/Character/"+this.state.charactedId+"/Stats/UniqueWeapons/", {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
          },
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if(responseJson['ErrorCode'] != "1"){
              this.setState({
                error: "https://www.bungie.net/Platform/Destiny2/2/Account/"+this.state.membershipId+"/Character/"+this.state.charactedId+"/Stats/UniqueWeapons/",
                isLoading: false
              })
            } else {
              this.setState({
                weaponStatsById: responseJson['Response']['weapons'],
                isLoading: false,
              })
            }
          })
          .catch((error) =>{
            console.error(error);
          });
      }
    
      makeWeaponsCards() {
        let weaponStatsById = this.state.weaponStatsById;
        let itemInfo = "-";
        if(this.state.error){
          return (
            <Text style={{color: "red"}}>{this.state.error}</Text>
          )
        }
    
        // for(w in weaponStatsById){
        //   this.setState((prevState) => ({
        //     test: prevState.test + w['referenceId']+"|"
        //   }))
        //   this.getWeaponInfo(w['referenceId']);
        // }
    
        let itemRef = this.state.test
    
        return weaponStatsById.map(function(weapon,i){
          // this.getWeaponInfo(weapon['referenceId'])
          // .then((response) => {
          //   weapon['name'] = response['weaponName'],
          //   weapon['icon'] = response['weaponIcon'],
          //   itemInfo = JSON.stringify(response,null,2)
          // })
          return (
            <View style={{margin: 5, backgroundColor: "gray"}} key={i}>
              <Text style={{color:"blue"}}>{itemRef}</Text>
              {/* <Text>Name = {itemRef[weapon['referenceId']]['name']}</Text> */}
              <Text>Id = {weapon['referenceId']}</Text>
              <Text>Kills = {weapon['values']['uniqueWeaponKills']['basic']['value']}</Text>
            </View>
          )
        })
      }
    
      render() {
        this.getUniqueWeaponStats();
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 23}}>
              <ActivityIndicator/>
            </View>
          )
        }
        return (
          <ScrollView>
            {this.makeWeaponsCards()}
          </ScrollView>
        )
      }
    }
    