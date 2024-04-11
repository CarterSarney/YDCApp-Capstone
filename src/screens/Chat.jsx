import React, { useCallback, useState, useEffect, Fragment} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../../Firebase/firebaseConfig';

import { collection, addDoc,  query, orderBy, onSnapshot } from 'firebase/firestore';

//https://github.com/FaridSafi/react-native-gifted-chat
import { GiftedChat} from 'react-native-gifted-chat';


//appended from https://medium.com/@katrinashui2023/react-native-firebase-chat-app-template-summarise-the-use-of-google-firebase-502cf0b17b48
const Chat = ({ navigation, route }) => {

  const currUser = auth?.currentUser.uid;
  const receiveUser = route.params.uid;

  const [messages, setMessages] = useState([]);


  useEffect(() => { 
    getAllMsg()
  },[]);

  //get all messages between the current user and receiver
const getAllMsg = async () => {

  //chatid is hardcoded for now but will be passed in through props later
    const chatid = receiveUser > currUser ? currUser+ "-" +receiveUser : receiveUser+ "-" +currUser

    //Pulls chat history from DB. Uses query to order the messages by time of creation, and immediately updates
    //the chat history when a new message is sent with onSnapshot
    const q = query(collection(db, 'Chats', chatid,'messages'),orderBy('createdAt', "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
      snapshot.docs.map(doc => ({...doc.data(),createdAt:doc.data().createdAt.toDate()}))
    )
    );
    
  }

  //When a message is sent it is added to the chat history, with the time and user who sent it and who it was sent to
  const onSendMsg = async (msgArray) => {
    const msg = msgArray[0]
    const time = new Date();
    const userMsg = {
      ...msg,
      sentBy: currUser,
      sentTo: receiveUser,
      createdAt: time
    }
    //Pulls from DB and adds the new message to the chat history
    setMessages(previousMessages => GiftedChat.append(previousMessages, userMsg))
    const chatid = receiveUser > currUser ? currUser+ "-" +receiveUser : receiveUser+ "-" +currUser
    
    const docRef = collection(db, 'Chats', chatid,'messages');
    await addDoc(docRef,{...userMsg,createdAt:time});

  }
  

  return (
    
        //Displays Chat
    <GiftedChat 
    messages={messages}
    onSend={text => onSendMsg(text)}
    user={{ 
      _id: currUser,
    }}
    
/>
  );
};

export default Chat;
