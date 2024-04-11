import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';




function Home({ navigation }) {
  const route = useRoute();
  
  const userUID = route.params.userUID;
  const userEmail = route.params.userEmail;
  const userRole = route.params.userRole;
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>

        {(userRole == 'Admin User' || userRole == 'Volunteer User') && (
          <View style={styles.buttonBlock}>
            <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Schedule', {userEmail, userRole, userUID})}>
              <Text style={styles.title}>Scheduler</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Food')}>
            <Text style={styles.title}>Food Voting</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('ChatList')}>
            <Text style={styles.title}>Contacts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonBlock}>
          <TouchableOpacity style={styles.buttonBlock} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.title}>Settings</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default Home;
