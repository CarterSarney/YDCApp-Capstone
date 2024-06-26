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

    const { userUID } = route.params;

    useEffect(() => {
        //Starts the check for users
        const fetchUsers = async () => {
            try {
                //Pulls all users from the database where the first name matches the search
                const q = query(collection(db, 'users'), where('firstname', '==', search), where('firstname', '<=', search + '\uf8ff'));
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
        if (search.trim() !== '') {
            fetchUsers();
        }
    }, [search, navigation]);

    useEffect(() => {
        //Loads the chatted users from Firebase and maps them to chattedUserList
        const loadChattedUsers = async () => {
            try {
                const q = query(collection(doc(db, 'users', userUID), 'chattedUsers'));
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
    
    //Allows for after you select a user to chat with it will navigate to the chat screen
    const handleSelect = async (user) => {
        navigation.navigate('Chat', {name: user.firstname, uid: user.uid});
        const updatedUsers = [...chattedUsers, user];
        try {
            const chattedUsersRef = doc(db, 'users', userUID, 'chattedUsers', user.id);
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
        backgroundColor: '#ffffff', 
        paddingVertical: 12, 
        paddingHorizontal: 16, 
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee', 
        flexDirection: 'row',
        alignItems: 'center', 
        marginTop: 8, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.1,
        shadowRadius: 1, 
        elevation: 2, 
      },
      button: {
        backgroundColor: '#1170FF',
        marginTop:50,
      },
      nameText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333', 
        padding: 8,
        borderWidth: 1,
        borderColor: '#dddddd', 
        borderRadius: 5,
        backgroundColor: '#f7f7f7', 
        marginTop: 4, 
        overflow: 'hidden', 
      },
      msgContent: {
        paddingTop: 5,
        color: '#666', 
        fontSize: 14,
      },
      input: {
        width: '100%',
        padding: 15,
        marginVertical: 10, 
        borderWidth: 1,
        borderColor: '#cccccc', 
        borderRadius: 5,
        backgroundColor: '#ffffff',
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