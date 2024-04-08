import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { StackActions, useRoute } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseConfig';



function Home({ navigation }) {
  const route = useRoute();
  
  const userUID = route.params.userUID;
  const userEmail = route.params.userEmail;
  const userRole = route.params.userRole;
  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User: ', userEmail, ' is logging out');
        navigation.dispatch(StackActions.pop(1))
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Schedule', {userEmail, userRole, userUID})}>
            <Text style={styles.title}>Scheduler</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Food')}>
            <Text style={styles.title}>Food Voting</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('ChatList')}>
            <Text style={styles.title}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.title}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <Button
            mode="contained" 
            onPress={handleLogout}
            color="#FFFFFF" 
            labelStyle={{ color: 'black' }} // This sets the text color; adjust as needed
>
Logout
</Button>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1170FF',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20, 
    alignSelf: 'center',
    padding: 20,
    
    
  },
  buttonBlock: {
    marginBottom: 40,
    marginTop: 40,
    width: 250,
    height: 100,
    borderRadius: 15,
    color: '#000000',
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
}});

export default Home;