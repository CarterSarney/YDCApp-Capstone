import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

// Import the necessary functions from firebase/firestore
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebaseConfig';

const Dashboard = () => {
    // State for user fields
    const [userDetails, setUserDetails] = useState({
      email: '',
      firstName: '',
      lastName: ''
    });

    const [docId, setDocId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userUID = auth.currentUser?.uid;
            if (userUID) {
                const userRef = collection(db, 'users');
                const q1 = query(userRef, where("uid", "==", userUID));

                getDocs(q1)
                    .then((snap) => {
                        if (!snap.empty) {
                            const docData = snap.docs[0].data();
                            const docId = snap.docs[0].id;
                            setUserDetails({
                                email: docData.email,
                                firstName: docData.firstname,
                                lastName: docData.lastname
                            });
                            setDocId(docId);
                        } else {
                            console.log('No matching documents.');
                        }
                    })
                    .catch(err => {
                        console.error('Error: ', err);
                    });
            } else {
                console.log('No user is logged in.');
            }
        };

        fetchUserData();
    }, []);

    const handleSaveChanges = async () => {
        if (docId) {
            const userRef = doc(db, 'users', docId);
            updateDoc(userRef, {
                email: userDetails.email,
                firstname: userDetails.firstName,
                lastname: userDetails.lastName
            })
            .then(() => {
                Alert.alert('Success', 'Your profile has been updated.');
            })
            .catch((error) => {
                Alert.alert('Error', 'There was a problem updating your profile.');
                console.error("Error updating document: ", error);
            });
        }
    };

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Edit Profile</Text>
        </View>
        <View style={styles.profilePicContainer}>
          <TouchableOpacity>
            {/* Placeholder for profile image - replace this with <Image> or similar */}
            <View style={styles.profilePicPlaceholder}>
              <Text style={styles.profilePicText}>Profile Picture</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            value={userDetails.email}
            onChangeText={(text) => setUserDetails({ ...userDetails, email: text })}
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            value={userDetails.firstName}
            onChangeText={(text) => setUserDetails({ ...userDetails, firstName: text })}
            placeholder="First Name"
            style={styles.input}
          />
          <TextInput
            value={userDetails.lastName}
            onChangeText={(text) => setUserDetails({ ...userDetails, lastName: text })}
            placeholder="Last Name"
            style={styles.input}
          />
          <Button
            title="Save Changes"
            onPress={handleSaveChanges}
          />
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    marginTop: 50,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it circular
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicText: {
    textAlign: 'center',
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
  },
});

export default Dashboard;
