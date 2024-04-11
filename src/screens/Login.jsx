import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, Image, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseConfig';
import { TextInput, Button } from 'react-native-paper';

// Import the logo
const logo = require('../../assets/images/logo.png'); // Update the path accordingly

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigation.navigate('MainApp', {
          screen: 'Home',
          params: {
            userUID: user.uid,
            userEmail: user.email,
            userRole: 'Regular User' // Placeholder, replace with actual user role from your DB
          },
        });
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
          secureTextEntry
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Login
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Signup')} style={styles.button}>
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
