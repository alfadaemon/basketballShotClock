import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';

async function playSound() {
  const { sound } = await Audio.Sound.createAsync(require('./assets/sounds/beep-1-sec.mp3')
  );
  sound.setVolumeAsync(1.0)
  await sound.playAsync()
}

export default function App() {
  const [remainingSeconds, setRemainingSeconds] = useState(24)
  const [isRunning, setIsRunning] = useState(false)
  const [fontsLoaded] = useFonts({ 'Orloj': require("./assets/fonts/Orloj.otf") })
  
  useEffect(() => {
    let interval = null
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(remainingSeconds => remainingSeconds - 1)
      }, 998);
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
        <TouchableOpacity onPress={() => setIsRunning(true)}>
          <View style={styles.roundButton}><Text style={styles.roundButtonText}>Play</Text></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsRunning(false)}>
          <View style={styles.roundButton}><Text style={styles.roundButtonText}>Pause</Text></View>
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
