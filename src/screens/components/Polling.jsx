import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { Button } from 'react-native-paper';

const Polling = ({ navigation, route }) => {
  const routeParams = route.params;
  if (!routeParams) {
    console.log('route.params is undefined');
    return;
  }

  const { recentOptions } = routeParams;
  const options = recentOptions.map(item => item.name);
  const [votes, setVotes] = useState(new Array(options.length).fill(0));
  const [timer, setTimer] = useState(null);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleVote = (optionId) => {
    const updatedVotes = [...votes];
    const optionIndex = recentOptions.findIndex(option => option.id === optionId);
    if (optionIndex !== -1) {
      updatedVotes[optionIndex]++;
      setVotes(updatedVotes);
    }
  };

  const startTimer = () => {
    // Convert days, hours, minutes, and seconds to seconds
    const durationInSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60) + seconds;
    setTimer(durationInSeconds);
  };

  const stopTimer = () => {
    setTimer(null);
  };

  const clearVotes = () => {
    setVotes(new Array(options.length).fill(0));
  };

  useEffect(() => {
    if (timer === null) return; // Don't start timer if null

    // Start the countdown
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return null;
        }
        return prevTimer - 1;
      });
    }, 1000); // Update every second

    // Clear the interval when the component unmounts or when the timer is up
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    // Update days, hours, minutes, and seconds when the timer changes
    let remainingTime = timer;
    const newDays = Math.floor(remainingTime / (24 * 60 * 60));
    remainingTime -= newDays * (24 * 60 * 60);
    const newHours = Math.floor(remainingTime / (60 * 60));
    remainingTime -= newHours * (60 * 60);
    const newMinutes = Math.floor(remainingTime / 60);
    remainingTime -= newMinutes * 60;
    setDays(newDays);
    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(remainingTime);
  }, [timer]);

  const totalVotes = votes.reduce((acc, cur) => acc + cur, 0);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Polling</Text>

      {/* Displaying total votes */}
      <View style={styles.totalVotesContainer}>
        <Text>Total Votes: {totalVotes}</Text>
      </View>

      {/* Input fields for timer duration */}
      <View style={styles.timerInputContainer}>
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          placeholder="Days"
          value={days.toString()}
          onChangeText={text => setDays(parseInt(text))}
        />
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          placeholder="Hours"
          value={hours.toString()}
          onChangeText={text => setHours(parseInt(text))}
        />
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          placeholder="Minutes"
          value={minutes.toString()}
          onChangeText={text => setMinutes(parseInt(text))}
        />
        <TextInput
          style={styles.timerInput}
          keyboardType="numeric"
          placeholder="Seconds"
          value={seconds.toString()}
          onChangeText={text => setSeconds(parseInt(text))}
        />
      </View>

      {/* Timer controls */}
      <View style={styles.timerControls}>
        <Button mode='contained' onPress={startTimer}>Start</Button>
        <Button mode='contained' onPress={stopTimer}>Stop</Button>
      </View>

      {/* Displaying countdown */}
      <Text style={styles.timerText}>
        {`${days}d ${hours}h ${minutes}m ${seconds}s`}
      </Text>

      {/* Clear votes button */}
      <Button mode='contained' onPress={clearVotes}>Clear Votes</Button>

      {/* Displaying options */}
      {recentOptions.map((option, index) => (
        <View style={styles.buttonBlock} key={option.id}>
          <Text>{option.name}: {votes[index]} votes</Text>
          {/* Allow voting only if the timer is active */}
          {timer !== null && (
            <TouchableOpacity onPress={() => handleVote(option.id)}>
              <Text>Vote for {option.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <Button mode='text' onPress={() => navigation.dispatch(StackActions.pop(1))}>Return</Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, 
    alignSelf: 'center', 
  },
  buttonBlock: {
    marginBottom: 20,
    width: '90%', 
    borderRadius: 10,
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  totalVotesContainer: {
    marginBottom: 30,
    width: '90%',
    borderRadius: 10,
    backgroundColor: '#f7f7f7', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  timerInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '90%', 
    marginBottom: 30, 
  },
  timerInput: {
    borderWidth: 1,
    borderColor: '#ddd', 
    borderRadius: 5,
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    backgroundColor: '#fff',
    width: '20%', 
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '60%', 
    alignSelf: 'center', 
    marginBottom: 30, 
  },
  timerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30, 
  },

});

export default Polling;

