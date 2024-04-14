import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../Firebase/firebaseConfig';
import { TextInput, Button } from 'react-native-paper';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Import the logo
const logo = require('../../assets/images/logo.png'); // Update the path accordingly

const Login = ({ navigation }) => {
  const userRef = collection(db, 'users');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passVisible, setPassVisible] = useState(false);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const email = user.email;
        const uid = user.uid;
        let role;
        const q = query(userRef, where('uid', '==', user.uid));
        
        getDocs(q)
          .then(snap => {
            snap.docs.forEach(doc => {
              role = doc.data().role;
            })

            navigation.navigate('MainApp', {
                userEmail: email,
                userUID: uid,
                userRole: role
            });
          })
          .catch(err => {
            console.error('Error: ', err);
          })
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>
      <View style={styles.formContainer}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          secureTextEntry={!passVisible}
          onChangeText={setPassword}
          autoCapitalize="none"
          right={
            <TextInput.Icon 
                icon={!passVisible ? "eye" : "eye-off" }
                size={20}
                onPress={() => setPassVisible(!passVisible)}
            />
          }
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Signup', {email})} style={styles.button}>
          Sign Up
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 200, // Adjust the margin as needed
  },
  formContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 25, // Adjust the margin as needed
  },
  logo: {
    width: 390, // Adjust the width as needed
    height: 600, // Adjust the height as needed
    resizeMode: 'contain',
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
  },
  button: {
    marginTop: 2, // Add spacing between buttons
  },
});

export default Login;
