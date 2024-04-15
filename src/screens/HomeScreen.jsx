import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebaseConfig';


const logo = require('../../assets/images/logo.png'); 

function HomeScreen({ route, navigation }) {
  
  // Use optional chaining to safely access parameters
  // const userUID = route.params?.userUID;
  // const userEmail = route.params?.userEmail;
  // const userRole = route.params?.userRole;

  const { userRole, userEmail } = route.params;

  const [userName, setUserName] = useState('');

  // Handle the case when parameters are undefined
  if (!userRole || !userEmail) {
    // If any of the parameters are undefined, handle it appropriately here
    navigation.navigate('Login');
    return null; // Return null to prevent rendering the rest of the component
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("uid", "==", auth.currentUser.uid));

        getDocs(q)
          .then((snapshot) => {
            if (!snapshot.empty) {
              const docData = snapshot.docs[0].data();
              setUserName(docData.firstname);
            } else {
              console.log('No matching documents.');
            }
          })
          .catch(err => {
            console.error('Error fetching user data:', err);
          });
      } else {
        console.log('No user is logged in.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Image */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Welcome, {userName}</Text>
      
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
    width: 400, 
    height: 400, 
  },
  title: {
    fontSize: 26,
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

