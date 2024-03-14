import { useState } from 'react';
import { Button, Text } from 'react-native';
import { firebase } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../Firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, IconButton, Icon, MD3Colors } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Tie information only related to the user to its uuid

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [visible, setVisibile] = useState(false);

  //Move Signup to its own page for cleaner interface
  const handleSignUp = () => {
    //Sending email if it has been filled to the sign up page to save sign up time if an account does not exist
    setErrorMessage(null);
    navigation.navigate('Signup Auth', {email});
  };

  const handleLogin = () => {
    //Input validation for email and password
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /\s/; //Password input should not contain any spaces

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      console.warn('User tried to enter suspicious text in one of the inputs: ', email, ', ', password);
      setErrorMessage('Invalid email or password input');
    } else {
      signInWithEmailAndPassword(auth, email, password)
      .then(user => {
        setErrorMessage(null);
        console.log(user);
        navigation.navigate('Youth Drop-In Center');
      })
      .catch(error => {
        setErrorMessage(error.message);
        console.log('Error when user trying to log in: ', error);
      });
    }

  };

  return (
    <SafeAreaView>
      {errorMessage && <Text>{errorMessage}</Text>}
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={email => setEmail(email)}
      />
      <TextInput
        secureTextEntry={!visible}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={password => setPassword(password)}
        right={
          <TextInput.Icon 
            name="eye" //Not working
            size={20}
            onPress={() => setVisibile(!visible)}
          />
        }
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign Up" onPress={handleSignUp} />
    </SafeAreaView>
  );
};

export default Login;