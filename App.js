import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';

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
      <StatusBar hiiden/>
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
    justifyContent: 'space-around',
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
    padding: 50,
  },
  roundButton: {
    alignItems: 'center',
    fontColor: '#FFF',
    justifyContent: 'center',
    borderRadius: 80,
    backgroundColor: '#2e6e03',
    margin: 10,
    width: 80,
    height: 80,
  },
  roundButtonText: {
    color: '#FFF',
    fontSize: 30,
  }
});
