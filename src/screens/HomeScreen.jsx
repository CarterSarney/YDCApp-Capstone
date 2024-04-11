import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

function HomeScreen({ navigation }) {
  const route = useRoute();
  
  // Use optional chaining to safely access parameters
  const userUID = route.params?.userUID;
  const userEmail = route.params?.userEmail;
  const userRole = route.params?.userRole;

  // Handle the case when parameters are undefined
  if (!userUID || !userEmail || !userRole) {
    // If any of the parameters are undefined, handle it appropriately here
    // For example, navigate back to the login screen or display an error
    navigation.navigate('Login');
    // Return null to prevent rendering the rest of the component
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        {(userRole === 'Admin User' || userRole === 'Volunteer User') && (
          <TouchableOpacity 
            style={styles.buttonBlock} 
            onPress={() => navigation.navigate('Schedule', { userEmail, userRole, userUID })}
          >
            <Text style={styles.title}>Scheduler</Text>
          </TouchableOpacity>
        )}
        {/* Add other buttons with navigation as needed */}
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

export default HomeScreen;
