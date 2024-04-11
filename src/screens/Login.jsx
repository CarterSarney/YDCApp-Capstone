import { useState } from 'react';
import { Text, SafeAreaView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Firebase/firebaseConfig';
import { TextInput, Button } from 'react-native-paper';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Assuming you're passing the user's UID, email, and role to the HomeScreen
        navigation.navigate('MainApp', {
          screen: 'Home',
          params: {
            userUID: user.uid,
            userEmail: user.email,
            // You would retrieve the user role from your database
            userRole: 'Regular User' // Placeholder value
          },
        });
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <SafeAreaView>
      {errorMessage ? <Text>{errorMessage}</Text> : null}
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
      <Button mode="contained" onPress={handleLogin}>
        Login
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Signup')}>
        Sign Up
      </Button>
    </SafeAreaView>
  );
};

export default Login;
