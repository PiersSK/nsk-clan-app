import React from "react"
import { DrawerNavigator, StackNavigator, Navigation } from 'react-navigation';
import { TouchableHighlight } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import Icon from 'react-native-vector-icons/FontAwesome';

// get views
import RosterScreen from "./app/views/roster.js"
import CharacterScreen from "./app/views/characters.js"
import CharacterDetailsScreen from "./app/views/characterDetails.js"
import LeaderboardScreen from "./app/views/leaderboards";


const RosterStack = StackNavigator(
  {
    Roster: {
      screen: RosterScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: '#0b1c38'},
        title: 'Clan Roster',
        headerLeft: (
          <TouchableHighlight
            onPress={() => navigation.navigate('DrawerToggle')}
            underlayColor={"transparent"}>
            <Icon name={"bars"} size={25} color={"white"} style={{paddingLeft: 10}}/>
          </TouchableHighlight>
        ),
        headerTintColor: 'white',
      })
    },
    Characters: {
      screen: CharacterScreen,
      
    },
    CharacterDetails: {
      screen: CharacterDetailsScreen,
    }
  },
  {
    initialRouteName: "Roster",
    // headerMode: 'none'
  }
);

const LeaderStack = StackNavigator(
  {
    Leaderboards: {
      screen: LeaderboardScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: {backgroundColor: '#0b1c38'},
        title: 'Leaderboards',
        headerLeft: (
          <TouchableHighlight
            onPress={() => navigation.navigate('DrawerToggle')}
            underlayColor={"transparent"}>
            <Icon name={"bars"} size={25} color={"white"} style={{paddingLeft: 10}}/>
          </TouchableHighlight>
        ),
        headerTintColor: 'white',
      })
    },
  },
  {
    initialRouteName: "Leaderboards",
    // headerMode: 'none'
  }
);


const DrawerStack = DrawerNavigator(
  {
    Home: { 
      screen: RosterStack,
      navigationOptions: {
        title: "Clan Roster",
        drawerLabel: "Clan Roster",
        drawerIcon: () => (<Icon name={"users"} size={20} color={"white"} />)
      }
    },
    Leaderboards: { 
      screen: LeaderStack,
      navigationOptions: {
        title: "Leaderboards",
        drawerLabel: "Leaderboards",
        drawerIcon: () => (<Icon name={"list"} size={20} color={"white"} />)
      }
    },
  },
  {
    drawerBackgroundColor: '#050f21',
    contentOptions : {
      activeTintColor: "white",
      inactiveTintColor: "white",
      activeBackgroundColor: "#0b1c38" 
    },    
  }
)

  
export default StackNavigator(
  {
    home: { screen: DrawerStack },
  },
  {
    headerMode: 'none',
  }
)