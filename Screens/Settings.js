import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, Alert,View, Switch } from 'react-native';
import { useState, useRef } from 'react';
import { useRoute } from '@react-navigation/native'; 

const Settings = ({navigation} ) =>{
{/* Comment Format */}

const route = useRoute();
if (route.params?.settingDarkMode == true) //Should refactor settingDarkMode
{
   [isDarkMode, setIsDarkMode] = useState(route.params?.settingDarkMode);
}
else
{
   [isDarkMode, setIsDarkMode] = useState(false);
}
// isDarkMode ? yes: no
const toggleDarkMode = () => {
  setIsDarkMode(!isDarkMode);
  
};

    return(

        <View style={styles.container} backgroundColor = {isDarkMode ? '#131217' : '#ebf4f5'}>

            <Text style= {{ fontSize: 30, color: isDarkMode ? "#EEE" : "#000" }} >Settings</Text>
            <Text> {"\n"} </Text>
            <Text style= {{ fontSize: 15, color: isDarkMode ? "#EEE" : "#000" }} >Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{false: '#767577', true: 'orange'}} />
            <Text> {"\n"} </Text>
            <Button title="Back" color= {isDarkMode ? 'orange' : 'dodgerblue'} onPress={() => navigation.navigate('Home',{isDarkMode:isDarkMode})} />
        </View>
    )
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ebf4f5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: "white",
      borderRadius: 10,
      height: 40,
      paddingLeft: 20,
      width: 300
    },
    journal: {
      backgroundColor: "white",
      borderRadius: 10,
      paddingLeft: 20,
      height: 200,
      width: 300,
    },
  });

export default Settings