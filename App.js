import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, Alert,View, Switch } from 'react-native';
import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


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
    await AsyncStorage.setItem(getDate(), value); // Key for each item is the date that it was entered
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
  for (const key of keys) 
  {
    values[i]= key;
    values[i] +=  await AsyncStorage.getItem(key);
    //journalString += values[i] + "\n";
    
    i++;
  }
  
  values.sort(); //Works but want to find a way of only needing one 1 for loop to load journal
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

export default function App() {
  {/* Comment Format */}
  const [isDarkMode, setIsDarkMode] = useState(false);
  // isDarkMode ? yes: no
  const [text, setText] = useState('');
  const [selectedRating, setSelectedRating] = useState("3"); //Use state 3 defines the default for the picker
  const journalRef = useRef();
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  loadJournal(journalRef);

  {/* Don't forget to include necessary parameters for each function call */}
  return (
  <View style={styles.container} backgroundColor = {isDarkMode ? '#131217' : '#ebf4f5'}>
    <Text> {"\n"} </Text>
    <Text style= {{ fontSize: 30, color: isDarkMode ? "#EEE" : "#000" }} >Welcome to DayRater!</Text>
    <Text> {"\n"} </Text>

    <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{false: '#767577', true: 'orange'}} />
    <StatusBar style="auto" />
      
    <TextInput
      editable= {false}
      multiline={true}
      ref={journalRef}
      numberOfLines= {3}
      style = {styles.journal}
      backgroundColor = {isDarkMode ? '#27262b' : 'white'}
      color = {isDarkMode ? 'white' : 'black'}
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
      backgroundColor = {isDarkMode ? '#27262b' : 'white'}
      color = {isDarkMode ? 'white' : 'black'}
    />
  
    <Picker itemStyle={{color : isDarkMode ? 'white' : 'black'}}
      style={{height: 150, width:75}}
      selectedValue={selectedRating}
      onValueChange={(itemValue, itemIndex) => setSelectedRating(itemValue)}>
      <Picker.Item label="1" value="1" />
      <Picker.Item label="2" value="2" />
      <Picker.Item label="3" value="3" />
      <Picker.Item label="4" value="4" />
      <Picker.Item label="5" value="5" />
    </Picker>

    <Text> {"\n"} </Text>

    <TextInput
      placeholder="Enter"
      placeholderTextColor='gray'
      value={null}
      onChangeText={newText => setText(newText)}
      style={styles.input}
      backgroundColor = {isDarkMode ? '#27262b' : 'white'}
      color = {isDarkMode ? 'white' : 'black'}
    />

    <Button
      title="Add"
      color= {isDarkMode ? 'orange' : 'dodgerblue'}
      onPress={() => {storeData(selectedRating  + "/5 " +text, journalRef);}} 
    />
    
    <Button
      title="Delete"
      color= {isDarkMode ? 'orange' : 'dodgerblue'}
      onPress={() => deleteAllItems(journalRef)} 
    />


    </View>

  );

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