import React from "react"
import { DrawerNavigator, StackNavigator, Navigation } from 'react-navigation';
import Ionicons from "react-native-vector-icons/Ionicons"
import Icon from 'react-native-vector-icons/FontAwesome';

// get views
import RosterScreen from "./app/views/roster.js"
import CharacterScreen from "./app/views/characters.js"
import CharacterDetailsScreen from "./app/views/characterDetails.js"


const RosterStack = StackNavigator(
  {
    Roster: {
      screen: RosterScreen,
      navigationOptions: {
        header: null
      }
    },
    Characters: {
      screen: CharacterScreen,
    },
    CharacterDetails: {
      screen: CharacterDetailsScreen,
    }
  },
  {
    initialRouteName: "Roster"
  }
);


export default DrawerNavigator(
  {
    Home: { 
      screen: RosterStack,
      navigationOptions: {
        drawerLabel: "Clan Roster",
        drawerIcon: () => (<Icon name={"users"} size={20} color={"red"} />)
      }
    },
  },
  {
    drawerBackgroundColor: "#070707",
    contentOptions : {
      activeTintColor: "white",
      inactiveTintColor: "#efb20b"
    }
  }
);