import { DrawerNavigator, StackNavigator, Navigation } from 'react-navigation';

// get views
import HomeScreen from "./app/views/home.js"
import CharacterScreen from "./app/views/characters.js"

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
});
