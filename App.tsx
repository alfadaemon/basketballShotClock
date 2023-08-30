import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';

enum AddRemoveSecond {
  Add = 1,
  Remove = -1,
}

export default function App() {
  const [remainingSeconds, setRemainingSeconds] = useState(24)
  const [isRunning, setIsRunning] = useState(false)
  const [fontsLoaded] = useFonts({ 'Orloj': require("./assets/fonts/Orloj.otf") })
  
  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/beep-1-sec.mp3')
      );
      await sound.playAsync()
    }
    
    let interval = null
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(remainingSeconds => remainingSeconds - 1)
      }, 1000);
    } else if (remainingSeconds <= 0) {
      setIsRunning(false)
    } else if (!isRunning && remainingSeconds <= 0) {
      clearInterval(interval)
    }
    
    if (isRunning && remainingSeconds == 10) {
      playSound()
    }
    
    return () => {
      clearInterval(interval)
    }
  }, [isRunning, remainingSeconds])
  
  const addRemoveSecond = (addOrRemove: AddRemoveSecond) => {
    if (addOrRemove == AddRemoveSecond.Add && remainingSeconds < 24)
      setRemainingSeconds(remainingSeconds + 1)
    
    else if (addOrRemove == AddRemoveSecond.Remove && remainingSeconds > 1)
      setRemainingSeconds(remainingSeconds - 1)
  }
  
  if (!fontsLoaded) {
    return <View><Text>Loading</Text></View>
  }
  
  const iconName = isRunning ? "md-pause" : "md-play"
  return (
    <View style={styles.container}>
      <View style={styles.clockContainer}>
        <Text style={[styles.clockText, {fontFamily: "Orloj", color: "#F00"}]}>{remainingSeconds}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity disabled={isRunning} onPress={() => addRemoveSecond(AddRemoveSecond.Remove)}>
          <View style={[styles.roundButton]}><Ionicons name="md-remove" size={32} color="white" /></View>
        </TouchableOpacity>
        <TouchableOpacity disabled={isRunning} onPress={() => addRemoveSecond(AddRemoveSecond.Add)}>
          <View style={styles.roundButton}><Ionicons name="md-add" size={32} color="white" /></View>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity onPress={() => setRemainingSeconds(24)}>
          <View style={styles.roundButton}><Text style={styles.roundButtonText}>24</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRemainingSeconds(14)}>
          <View style={styles.roundButton}><Text style={styles.roundButtonText}>14</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRunning(!isRunning)}>
          <View style={styles.roundButton}><Ionicons name={iconName} size={32} color="white" /></View>
        </TouchableOpacity>
        
      </View>
      <StatusBar hidden/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#000',
  },
  clockText: {
    color: '#0f0',
    fontSize: 300,
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 30,
  },
  roundButton: {
    alignItems: 'center',
    fontColor: '#FFF',
    justifyContent: 'center',
    borderRadius: 80,
    backgroundColor: '#2e6e03',
    margin: 10,
    padding: 10,
    width: "auto",
    height: "auto",
  },
  roundButtonDisabled: {
    backgroundColor: 'red'
  },
  roundButtonText: {
    color: '#FFF',
    fontSize: 30,
  },
  separator: {
    width: "15%"
  }
});
