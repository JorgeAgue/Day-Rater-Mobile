import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, Alert,View, Switch } from 'react-native';
import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import Settings from './Screens/Settings';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native'; 
import 'react-native-reanimated'; //Fixes the crashing bug when navigating


function getDate() //Gets the date in M/D Day: format
{
  let date= new Date();
  var dateM = date.getMonth() +1; //Month
  var dateT= date.toLocaleTimeString('en-us', {weekday: 'short'}).substring(0,3); //Name of day

  var dateString= ""+ dateM + "/" + date.getDate() + " " + dateT + ":";

  return dateString;
}

const storeData = async (value, journalRef) =>  //Stores entry into async storage
{
  try {
    await AsyncStorage.setItem(getDate(), value); // Key for each item is the date that it was entered (May cause problems when sorting since date doesn't include the year)
    loadJournal(journalRef);
  } catch (e) {
   
  }
};

const fetchAllItems = async () => //Prints all entries to console, not actually needed
{
  AsyncStorage.getAllKeys()
    .then((keys)=> AsyncStorage.multiGet(keys).then((data) => console.log(data)));
}


const loadJournal = async (journalRef) => //Loads all entries from async storage and displays them on journal box
{
  let journalString = "";
  
  let keys = [];
  let values= [];
  let i =0;
  
  keys = await AsyncStorage.getAllKeys()
  //Since I don't have years on the journal, this will not work with overlapping dates
  keys.sort(function(a, b) {
    a = a.toString().split('/');
    a[1]= a[1].substring(a[1].indexOf('/')+1, a[1].indexOf(' ')); // Removes the "Mon:" part from the day number
    b = b.toString().split('/');
    b[1]= b[1].substring(b[1].indexOf('/')+1, b[1].indexOf(' '));

    return a[2] - b[2] || a[0] - b[0] || a[1] - b[1];});  //Sorts the keys by date
  
    for (const key of keys) 
  {
    values[i]= key;
    values[i] +=  await AsyncStorage.getItem(key);
    //journalString += values[i] + "\n";
    
    i++;
  }
  
  //values.sort(); 
  i=0;
  
  for (const value of values)
  {
    journalString += value + "\n";
    i++;
  }
  journalRef.current.setNativeProps({ text: journalString });
  journalRef.current.value = journalString.slice(0, -2);
}

const deleteAllItems = async (journalRef) => //Deletes all entries from async storage after confirming with user
{
  Alert.alert('Are you sure', 'Delete all entries?', [
    {
      text: 'No',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Yes', onPress: () =>   AsyncStorage.getAllKeys()
                  .then((keys)=>  AsyncStorage.multiRemove(keys)
                  .then(console.log("All data deleted")).then(journalRef.current.setNativeProps({ text: "" })))
    },
  ]);

}
function HomeScreen({ navigation })
{
{/* Comment Format */}
var [isDarkMode, setIsDarkMode] = useState();
const route = useRoute();
var settingDarkMode = false;
if (route.params?.isDarkMode == true)
{
  [isDarkMode, setIsDarkMode] = useState(route.params?.isDarkMode,setIsDarkMode); //Doesn't actually change isDarkMode
  settingDarkMode = true;
}
else
{
   [isDarkMode, setIsDarkMode] = useState(false);
}
// isDarkMode ? yes: no
const [text, setText] = useState('');
const [selectedRating, setSelectedRating] = useState("3"); //Use state 3 defines the default for the picker
const journalRef = useRef();

loadJournal(journalRef);

{/* Don't forget to include necessary parameters for each function call */}
return (
<View style={styles.container} backgroundColor = {settingDarkMode ? '#131217' : '#ebf4f5'}>

  <Text style= {{ fontSize: 30, color: settingDarkMode ? "#EEE" : "#000" }} >Welcome to DayRater!</Text>
    
  <TextInput
    editable= {false}
    multiline={true}
    ref={journalRef}
    numberOfLines= {3}
    style = {styles.journal}
    backgroundColor = {settingDarkMode ? '#27262b' : 'white'}
    color = {settingDarkMode ? 'white' : 'black'}
  />

  {/* Find a better way of adding empty space */}

  <Text> {"\n"} </Text>
  
  <TextInput 
    editable={false}
    placeholder={getDate()}
    placeholderTextColor='gray'
    value={null}
    onChangeText={null}
    style={styles.input}
    backgroundColor = {settingDarkMode ? '#27262b' : 'white'}
    color = {settingDarkMode ? 'white' : 'black'}
  />

  <Picker itemStyle={{color : settingDarkMode ? 'white' : 'black'}}
    style={{height: 150, width:75}}
    selectedValue={selectedRating}
    onValueChange={(itemValue, itemIndex) => setSelectedRating(itemValue)}>
    <Picker.Item label="1" value="1" color = {settingDarkMode ? 'white' : 'black'} />
    <Picker.Item label="2" value="2" color = {settingDarkMode ? 'white' : 'black'} />
    <Picker.Item label="3" value="3" color = {settingDarkMode ? 'white' : 'black'} />
    <Picker.Item label="4" value="4" color = {settingDarkMode ? 'white' : 'black'} />
    <Picker.Item label="5" value="5" color = {settingDarkMode ? 'white' : 'black'} /> 
    {/* Find a better way of recoloring items */}
  </Picker>

  <Text> {"\n"} </Text>

  <TextInput
    placeholder="Enter"
    placeholderTextColor='gray'
    value={null}
    onChangeText={newText => setText(newText)}
    style={styles.input}
    backgroundColor = {settingDarkMode ? '#27262b' : 'white'}
    color = {settingDarkMode ? 'white' : 'black'}
  />

  <Button
    title="Add"
    color= {settingDarkMode ? 'orange' : 'dodgerblue'}
    onPress={() => {storeData(selectedRating  + "/5 " +text, journalRef);}} 
  />
  
  <Button
    title="Delete"
    color= {settingDarkMode ? 'orange' : 'dodgerblue'}
    onPress={() => deleteAllItems(journalRef)} 
  />
  <Button
    title="Settings"
    color= {settingDarkMode ? 'orange' : 'dodgerblue'}
    onPress={() => navigation.navigate('Settings',{settingDarkMode:settingDarkMode})} 
  />

  </View>

);
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
  <NavigationContainer>
  <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Settings" component={Settings} />
  </Stack.Navigator>
</NavigationContainer>
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