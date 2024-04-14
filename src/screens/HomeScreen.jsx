import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';

// Replace with the correct path to your logo file in the assets directory
const logo = require('../../assets/images/logo.png'); // Update the path to where your logo is stored

function HomeScreen({ navigation }) {
  const route = useRoute();
  
  // Use optional chaining to safely access parameters
  // const userUID = route.params?.userUID;
  // const userEmail = route.params?.userEmail;
  // const userRole = route.params?.userRole;

  const { userUID, userEmail, userRole } = route.params ?? {};

  // Handle the case when parameters are undefined
  if (!userUID || !userEmail || !userRole) {
    // If any of the parameters are undefined, handle it appropriately here
    navigation.navigate('Login');
    return null; // Return null to prevent rendering the rest of the component
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Image */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      
      {/* <View style={styles.buttonContainer}>
        {(userRole === 'Admin User' || userRole === 'Volunteer User') && (
          <TouchableOpacity 
            style={styles.buttonBlock} 
            onPress={() => navigation.navigate('Schedule', { userEmail, userRole, userUID })}
          >
            <Text style={styles.title}>Scheduler</Text>
          </TouchableOpacity>
        )}
      </View> */}
      <Text>
        Hello 
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#cbdcf5',
  },
  logo: {
    width: 400,  // Set a fixed width
    height: 400, // Set a fixed height
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

export default HomeScreen;

