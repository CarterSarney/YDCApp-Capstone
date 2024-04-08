import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../Firebase/firebaseConfig';
import { Alert, Text, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection} from 'firebase/firestore';
import { StackActions } from '@react-navigation/native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import PasswordStrengthIndicator from './components/PasswordStrengthIndicator';
//Came across this password cracker algorithm from randomly searching for password strength indicator libraries
import zxcvbn from 'zxcvbn';

const Signup = ({ route, navigation }) => {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const {email: initialEmail} = route.params;
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');
    const [passVisible, setPassVisibile] = useState(false);
    const [passReqVisible, setPassReqVisible] = useState(false);
    const [passErrorVisible, setPassErrorVisible] = useState(false);
    const [firstErrorVisible, setFirstErrorVisible] = useState(false);
    const [lastErrorVisible, setLastErrorVisible] = useState(false);
    const [emailErrorVisible, setEmailErrorVisible] = useState(false);
    const [strength, setStrength] = useState(null);

    //Regular expressions for validation
    //Regex for input validation meets requirements
    const firstNameRegex = /^[A-Za-z0-9\s]+$/;
    const lastNameRegex = /^[A-Za-z0-9\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /*
        At least one lowercase
        At least one uppercase
        At least one digit
        At least one special character
        At least 8 characters
    */
    const lowerRegex = /.*[a-z]/.test(password);
    const upperRegex = /.*[A-Z]/.test(password);
    const digitRegex = /.*\d/.test(password);
    const specialCharRegex = /.*[@$!%*?&]/.test(password);
    const minimCharRegex = /.{8,}/.test(password);
    //Whole password regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const testEmptyString = (string) => {
        if (string.trim() === '' || string === null) {
            return true;
        } else {
            return false;
        }
    }

    const checkFirst = () => {
        if (firstNameRegex.test(firstname)) {
            return true;
        } else {
            return false;
        }
    }
    
    const checkLast = () => {
        if (lastNameRegex.test(lastname)) {
            return true;
        } else {
            return false;
        }
    }

    const checkEmail = () => {
        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    const checkPass = () => {
        if (passwordRegex.test(password)) {
            return true;
        } else {
            return false;
        }
    }
    
    //Creates both the email and password for the user as well as a user collection relating to additional user info
    const handleSignUp = () => {
        //If the inputs look good then create the user
        if (checkEmail() && checkFirst() && checkLast() && checkPass() && strength >= 2) {
            createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                console.log('Created User:', cred.user);

                //Retrieve the user UID created
                const uid = cred.user.uid;
                //Store data connecting it to the UID
                const userData = {
                    uid: uid,
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    role: 'Regular User'
                };

                addDoc(collection(db, 'users'), userData)
                    .then((docRef) => {
                        console.log('User data stored into the database at', docRef.id);
                        //Returns to screen if successful
                        console.log('Returning user to login after successful user creation');
                        navigation.dispatch(StackActions.pop(1));
                    })
                    .catch((err) => {
                        console.error('Error storing data: ', err);
                    })
            })
            .catch((err) => {
                if (err.code == 'auth/email-already-in-use') {
                    Alert.alert('Error', 'This email already exists');
                    console.error('User tried to create an account with an existing email');
                } else {
                    console.error('Error creating user: ', err.message);
                }
            })
        } else if (strength < 2) {
            console.error('Users password is too weak');
            Alert.alert('Error', 'Password too weak');
        } else {
            console.error('User failed to enter information to one of the inputs');
            Alert.alert('Error', 'Missing input requirement(s)');
        }
    }
    
    //Constant update and check on the password
    useEffect(() => {
        setStrength(zxcvbn(password).score)
    });

    return (
        <SafeAreaView>
            <TextInput
                // style={}
                placeholder='First Name'
                autoCapitalize='words'
                onChangeText={firstname => setFirstName(firstname)}
                error={firstErrorVisible}
                placeholderTextColor={firstErrorVisible ? 'red' : undefined}
                onBlur={() => {
                    if (firstname.trim() === '' || firstname === null) {
                        setFirstErrorVisible(true);
                    } else {
                        setFirstErrorVisible(!checkFirst());
                    }
                }}
            />
            {firstErrorVisible && (
                <HelperText type='error' visible={!checkFirst()}>First Name Invalid!</HelperText>
            )}
            <TextInput
                // style={}
                placeholder='Last Name'
                autoCapitalize='words'
                onChangeText={lastname => setLastName(lastname)}
                error={lastErrorVisible}
                placeholderTextColor={lastErrorVisible ? 'red' : undefined}
                onBlur={() => {
                    if (lastname.trim() === '' || lastname === null) {
                        setLastErrorVisible(true);
                    } else {
                        setLastErrorVisible(!checkLast());
                    }
                }}
            />
            
            {lastErrorVisible && (
                <HelperText type='error' visible={!checkLast()}>Last Name Invalid!</HelperText>
            )}
            <TextInput
                placeholder='Email'
                autoCapitalize='none'
                onChangeText={email => setEmail(email)}
                value={email}
                error={emailErrorVisible}
                placeholderTextColor={emailErrorVisible ? 'red' : undefined}
                onBlur={() => {
                    if (email.trim() === '' || email === null) {
                        setEmailErrorVisible(true);
                    } else {
                        setEmailErrorVisible(!checkEmail());
                    }
                }}
            />
            {emailErrorVisible && (
                <HelperText type='error' visible={!checkEmail()}>Email Invalid!</HelperText>
            )}
            <TextInput
                secureTextEntry={!passVisible}
                placeholder="Password"
                autoCapitalize="none"
                onChangeText={password => setPassword(password)}
                right={
                <TextInput.Icon 
                    icon={!passVisible ? "eye" : "eye-off" }
                    size={20}
                    color={passErrorVisible ? 'red' : undefined}
                    onPress={() => setPassVisibile(!passVisible)}
                />
                }
                error={passErrorVisible}
                placeholderTextColor={passErrorVisible ? 'red' : undefined}
                onFocus={() => setPassReqVisible(!passReqVisible)}
                onBlur={() => {
                    setPassReqVisible(!passReqVisible)
                    if (password.trim() === '' || password === null) {
                        setPassErrorVisible(true)
                    } else {
                        setPassErrorVisible(!checkPass())
                    }
                }}
            />
            {passErrorVisible && (
                <HelperText type='error' visible={!checkPass()}>Password Invalid!</HelperText>
            )}
            {passReqVisible && (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <View style={styles.passReqContainer}>
                        <PasswordStrengthIndicator strength={strength}/>
                        <Text style={[styles.passReqText, (!testEmptyString(password) ? (minimCharRegex ? styles.validText : styles.invalidText) : undefined )]}>At least 8 characters</Text>
                        <Text style={[styles.passReqText, (!testEmptyString(password) ? (lowerRegex ? styles.validText : styles.invalidText) : undefined )]}>At least one lowercase</Text>
                        <Text style={[styles.passReqText, (!testEmptyString(password) ? (upperRegex ? styles.validText : styles.invalidText) : undefined )]}>At least one uppercase</Text>
                        <Text style={[styles.passReqText, (!testEmptyString(password) ? (digitRegex ? styles.validText : styles.invalidText) : undefined )]}>At least one digit</Text>
                        <Text style={[styles.passReqText, (!testEmptyString(password) ? (specialCharRegex ? styles.validText : styles.invalidText) : undefined )]}>At least one special character</Text>
                    </View>
                </View>
            )}
            <Button mode='contained' onPress={handleSignUp}>Sign up</Button>
            <Button mode='outlined' onPress={() => navigation.dispatch(StackActions.pop(1))} >Return</Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    passReqContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 15,
        marginTop: 10, // Adjust spacing as needed
    },
    passReqText: {
        marginTop: 10,
        fontSize: 13,
    },
    invalidText: {
        color: 'red',
    },
    validText: {
        color: 'green',
    },
})

export default Signup;