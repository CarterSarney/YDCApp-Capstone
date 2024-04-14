import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation, useRoute, StackActions } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebaseConfig';

const Dashboard = () => {
    const navigation = useNavigation();
    const route = useRoute();
    

    const { userUID, userEmail, userRole } = route.params || {};

    const [userDetails, setUserDetails] = useState({
        email: '',
        firstName: '',
        lastName: ''
    });

    const [docId, setDocId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = collection(db, 'users');
                const q = query(userRef, where("uid", "==", auth.currentUser.uid));

                getDocs(q)
                    .then((snapshot) => {
                        if (!snapshot.empty) {
                            const docData = snapshot.docs[0].data();
                            const docId = snapshot.docs[0].id;
                            setUserDetails({
                                email: docData.email,
                                firstName: docData.firstname, // Adjust according to your Firestore field names
                                lastName: docData.lastname
                            });
                            setDocId(docId);
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

    const handleSaveChanges = async () => {
        if (docId) {
            const userDocRef = doc(db, 'users', docId);
            updateDoc(userDocRef, {
                email: userDetails.email,
                firstname: userDetails.firstName, // Ensure these field names match your Firestore document
                lastname: userDetails.lastName
            })
            .then(() => Alert.alert('Success', 'Your profile has been updated.'))
            .catch((error) => {
                Alert.alert('Error', 'There was a problem updating your profile.');
                console.error("Error updating document:", error);
            });
        }
    };

    const handleLogout = () => {
        signOut(auth)
        .then(() => {
            navigation.dispatch(StackActions.popToTop());
            console.log('User logged out successfully');
        })
        .catch((error) => {
            console.log('Logout error:', error.message);
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Edit Profile</Text>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    value={userDetails.email}
                    onChangeText={text => setUserDetails(prev => ({ ...prev, email: text }))}
                    placeholder="Email"
                    style={styles.input}
                />
                <TextInput
                    value={userDetails.firstName}
                    onChangeText={text => setUserDetails(prev => ({ ...prev, firstName: text }))}
                    placeholder="First Name"
                    style={styles.input}
                />
                <TextInput
                    value={userDetails.lastName}
                    onChangeText={text => setUserDetails(prev => ({ ...prev, lastName: text }))}
                    placeholder="Last Name"
                    style={styles.input}
                />
                <Button
                    mode="contained"
                    onPress={handleSaveChanges}
                    style={{ marginBottom: 10, backgroundColor: '#007bff' }} // Bootstrap primary color for example
                >
                    Save Changes
                </Button>
                <Button
                    mode="contained"
                    onPress={handleLogout}
                    color="#f44336" // Using Material Design's red 500 for logout button
                    style={styles.button}
                >
                    Logout
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#cbdcf5',
    },
    headerContainer: {
        marginTop: 50,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 6,
        width: '100%',
        backgroundColor: 'white'
    },
    button: {
        backgroundColor: '#1170FF',
        marginTop:10,
      },
});

export default Dashboard;
