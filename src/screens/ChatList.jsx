import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { ScrollView } from 'react-native';

import { collection, getDocs, query, where, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig'; 
import { useRoute } from '@react-navigation/native';

function ChatList({navigation}) {
    const route = useRoute();
    const [users, setUsers] = useState([]);
    const [chattedUsers, setChattedUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    const currentUserId = "8uFBAc4qy5TLQIjNho3TPPPI6hv1";

    useEffect(() => {
        //Starts the check for users
        const fetchUsers = async () => {
            try {
                //Pulls all users from the database where the first name matches the search
                const q = query(collection(db, 'users'), where('firstname', '==', search));
                const querySnapshot = await getDocs(q);
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                //Sets the users state to the list of users
                setUsers(userList);
            } catch (error) {
                console.error('Error finding user list:', error);
            }
        };
        //When the search isn't empty it will fetch the users with whatever search is equal to
        if (search !== '') {
            fetchUsers();
        }
    }, [search, navigation]);

    useEffect(() => {
        const loadChattedUsers = async () => {
            try {
                const q = query(collection(doc(db, 'users', currentUserId), 'chattedUsers'));
                const querySnapshot = await getDocs(q);
                const chattedUsersList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setChattedUsers(chattedUsersList);
            } catch(e) {
                console.error('Error loading chatted users:', e);
            }
        };
    
        loadChattedUsers();
    }, []);
    
    const handleSelect = async (user) => {
        navigation.navigate('Chat', {name: user.firstname, uid: user.uid});
        const updatedUsers = [...chattedUsers, user];
        try {
            const chattedUsersRef = doc(db, 'users', currentUserId, 'chattedUsers', user.id);
            await setDoc(chattedUsersRef, user);
            setChattedUsers(updatedUsers);
        } catch(e) {
            console.error('Error saving chatted users:', e);
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Button mode="contained" style={styles.button} onPress={() => setModalVisible(true)}>
                Search Users
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <Card style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            value={search}
                            onChangeText={setSearch}
                            placeholder="Search for a user"
                        />
                        <FlatList
                            data={users}
                            keyExtractor={item => item.id}
                            renderItem={({item}) => (
                                <TouchableOpacity onPress={() => handleSelect(item)}>
                                    <Text>{item.firstname}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button style={styles.button} textColor='white' onPress={() => setModalVisible(false)}>
                            Close
                        </Button>
                    </Card>
                </View>
            </Modal>
            <FlatList
    data={chattedUsers}
    keyExtractor={item => item.id}
    renderItem={({item}) => (
        <TouchableOpacity onPress={() => navigation.navigate('Chat', {name: item.firstname, uid: item.uid})}>
            <View style={styles.card}>
                <Text style={styles.nameText}>{item.firstname}</Text>
                <Text style={styles.msgContent}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    )}
/>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#cbdcf5', 
        padding: 20,
      },
      card: {
        backgroundColor: '#ffffff', // White background for the card
        paddingVertical: 12, // Vertical padding for spacing
        paddingHorizontal: 16, // Horizontal padding for content inside the card
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee', // Light border for separation
        flexDirection: 'row',
        alignItems: 'center', // Center items in the row
        marginTop: 8, // Space between cards
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 1 }, // Shadow position for iOS
        shadowOpacity: 0.1, // Shadow opacity for iOS
        shadowRadius: 1, // Shadow blur radius for iOS
        elevation: 2, // Elevation for Android
      },
      button: {
        backgroundColor: '#1170FF',
        marginTop:50,
      },
      nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333', // Dark grey color for the text
        padding: 8,
        borderWidth: 1,
        borderColor: '#dddddd', // Soft border color
        borderRadius: 5,
        backgroundColor: '#f7f7f7', // Light grey background for the name
        marginTop: 4, // Margin at the top
        overflow: 'hidden', // Ensures the background doesn't bleed out of the border radius
      },
      msgContent: {
        paddingTop: 5,
        color: '#666', // Light grey for less emphasis on the message/email
        fontSize: 14,
      },
      input: {
        width: '100%', // Input field takes the full width of its container
        padding: 15,
        marginVertical: 10, // Vertical margin for spacing from other elements
        borderWidth: 1,
        borderColor: '#cccccc', // Border color for the input
        borderRadius: 5,
        backgroundColor: '#ffffff', // White background for the input field
      },
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
      header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
      },

})

export default ChatList;