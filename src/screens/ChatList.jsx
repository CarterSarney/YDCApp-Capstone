import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, TextInput } from 'react-native';
import { Button, Card } from 'react-native-paper';

import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Firebase/firebaseConfig'; 

function ChatList({navigation}) {
    const [users, setUsers] = useState([]);
    const [chattedUsers, setChattedUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const q = query(collection(db, 'users'), where('firstname', '==', search));
                const querySnapshot = await getDocs(q);
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
            } catch (error) {
                console.error('Error fetching user list:', error);
            }
        };

        if (search !== '') {
            fetchUsers();
        }
    }, [search, navigation]);

    const handleSelect = (user) => {
        navigation.navigate('Chat', {name: user.firstname, uid: user.uid});
        setChattedUsers(prevUsers => [...prevUsers, user]);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Button mode="contained" style={{marginTop:50}} onPress={() => setModalVisible(true)}>
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
                        <Button style={{marginTop:100}}onPress={() => setModalVisible(false)}>
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
        backgroundColor: '#f5f5f5', // Light grey background for the entire screen
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