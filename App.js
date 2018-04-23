import React from 'react';
import { FlatList, ActivityIndicator, Text, View, ScrollView, StyleSheet, Image, TouchableHighlight, ImageBackground } from 'react-native';
import { StackNavigator, Navigation } from 'react-navigation';

class AccountCard extends React.Component {
  render() {
    return (
      <View style={[
        styles.memberCard,
        {backgroundColor: this.props.member.isOnline?"rgb(69, 62, 59)":"rgba(69, 62, 59, 0.2)",
        borderColor: this.props.member.isOnline?"rgb(244, 220, 66)":"rgba(244, 220, 66, 0.2)"
        }]}>
        <Text style={styles.memberName}>{this.props.member.destinyUserInfo.displayName}</Text>
        <View style={{padding: 5, backgroundColor: this.props.member.isOnline?"#52af53":"#f44542",}}>
          <Image
            style={{width: 50, height: 50}}
            source={{uri: 'https://www.bungie.net'+this.props.member.bungieNetUserInfo.iconPath}}
          />
        </View>
      </View>
    )
  }
}

class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  getClanMembers() {
    return fetch("https://www.bungie.net/platform/GroupV2/1159135/members/", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': '9997abb282fe4698977c1d6391d25c43'
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          memberInfo: responseJson['Response']['results'],
        })
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  makeAccountCards() {
    let memberList = this.state.memberInfo.sort((x, y) => {
      return x.isOnline ? -1 : y.isOnline ? 1 : 0;
    })
    const { navigate } = this.props.navigation

    return memberList.map(function(member, i){
      if(!member.hasOwnProperty("bungieNetUserInfo")){
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

  componentDidMount(){
    this.getClanMembers()
    .then(() => {
      this.setState({
        isLoading: false,
      })
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
        source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}}   
        style={{width: "100%", height: "100%"}} 
        >
        <ScrollView style={{paddingTop: 5}}>
          {this.makeAccountCards()}
        </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}

class CharacterCard extends React.Component {
  render() {
    const classRef = {
      "0": "Titan",
      "1": "Hunter",
      "2": "Warlock",
    }, hoursPlayed = Math.round((Number(this.props.character.minutesPlayedTotal) / 60)*100)/100

    return (
      <View style={[styles.characterCard, styles.memberCard]}>
        <View>
          <Text style={{color:"white", fontSize:20, fontWeight:"bold"}}>{classRef[this.props.character.classType]}</Text>
          <Text style={{color:"cyan", fontSize:16, fontWeight:"bold"}}>* {this.props.character.light}</Text>
          <Text style={{color:"orange", fontSize:14, fontStyle:"italic"}}>Hours Played: {hoursPlayed}</Text>
        </View>
        <Image
            style={{width: 50, height: 50}}
            source={{uri: 'https://www.bungie.net'+this.props.character.emblemPath}}
          />
      </View>
    )
  }
}

class CharacterScreen extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true, error: false}
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.playerName}`,
     headerTitleStyle : {textAlign: 'center',alignSelf:'center',color:"rgb(244, 220, 66)"},
        headerStyle:{
            backgroundColor:'gray',
        },
    });

  getCharacterIds() {
    return fetch("https://www.bungie.net/platform/Destiny2/2/Profile/"+this.props.navigation.state.params.membershipId+"?components=200", {
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
            error: "Error getting Character info"
          })
        } else {
          let characterIds = [];
          for(characterId in responseJson["Response"]["characters"]["data"]) {
            characterIds.push(characterId);
          }
          this.setState({
            characters: responseJson["Response"]["characters"]["data"],
            isLoading: false,
            mainCharacter: characterIds[0],
          })
        }
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  makeCharacterCards() {

    if(this.state.error){
      return(
        <Text style={{color:"red"}}>{this.state.error}</Text>
      )
    };

    const { navigate } = this.props.navigation;

    let membershipId = this.props.navigation.state.params.membershipId;
    let characters = this.state.characters;
    let characterList = []
    for(character in characters) {
      characterList.push(characters[character])
    }

    return characterList.map(function(character, i){
      return(
        <TouchableHighlight
          onPress={() => navigate("CharacterDetails", {membershipId: membershipId, characterId: character.characterId})}
          underlayColor={"transparent"}
          key={i} >
          <CharacterCard character={character} key={i}/>
        </TouchableHighlight>
      );
    })
    
  }

  render() {
    this.getCharacterIds();
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 23}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={[StyleSheet.absoluteFill]}>
      <ImageBackground
        source={{uri: 'https://alphalupi.bungie.net/images/background.jpg'}}   
        style={{width: "100%", height: "100%"}} 
        >
        <ScrollView style={{paddingTop: 5}}>
          {this.makeCharacterCards()}
          <Text>{JSON.stringify(this.state.characters, null, 2)}</Text>
        </ScrollView>
        </ImageBackground>
      </View>
    )
  }
}

class CharacterDetailsScreen extends React.Component{

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

export default StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null
    }
  },
  Characters: {
    screen: CharacterScreen,
  },
  CharacterDetails: {
    screen: CharacterDetailsScreen
  }
});

const CharacterStack = StackNavigator({
  Characters: {
    screen: CharacterScreen,
  },
  CharacterDetails: {
    screen: CharacterDetailsScreen
  }
})

const styles = StyleSheet.create({
  memberCard: {
    margin: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    borderWidth: 2
  },
  characterCard: {
    borderColor: "rgb(244, 220, 66)",
    backgroundColor: "rgba(69, 62, 59, 0.8)"
  },
  memberName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  }
})