import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView,
    Modal,
    ScrollView,
    Platform,
    Pressable,
    KeyboardAvoidingView,
} from 'react-native';
/*
    Using a library that created agendas already from: https://github.com/wix/react-native-calendars
    https://www.youtube.com/watch?v=RdaQIkE47Og&t=803s&ab_channel=JonasGr%C3%B8ndahl -- Agenda guide
*/
import { Agenda } from 'react-native-calendars';
/*
    Using a library that has components ready to be used in production: https://callstack.github.io/react-native-paper/
*/
import { Card, Button, IconButton, TextInput } from 'react-native-paper';
/*
    Using moment to format dates
*/
import moment from 'moment';
/*
    Imports for the database end
*/
import { db } from '../../Firebase/firebaseConfig'; 
import { collection, addDoc, getDocs, onSnapshot, query, where, arrayUnion, updateDoc, doc, documentId } from 'firebase/firestore';

/*
    Import for navigation around
*/
import { StackActions, useRoute } from '@react-navigation/native';
/*
    Import for date time pickers and help from:
    https://www.youtube.com/watch?v=UEfFjfW7Zes&t=124s&ab_channel=ToThePointCode -- Date Time Picker IOS and Android 
*/
import RNDateTimePicker from '@react-native-community/datetimepicker';
//import uuid from 'react-native-uuid';
import uuid from 'react-native-uuid'

const Schedule = ({ navigation }) => {
    //Route params from login
    const route = useRoute();
    const userEmail = route.params.userEmail;
    const userRole = route.params.userRole;
    const userUID = route.params.userUID;
    //Databse references
    const scheduleRef = collection(db, 'schedule');
    //Items for card
    const [items, setItems] = useState([]);
    //Current date
    const [currDate, setCurrDate] = useState(new Date());
    //States for schedule button
    const [containsUser, setContainsUser] = useState(false);
    const [registerModalStatus, setRegisterModalStatus] = useState(false);
    const [userRegister, setUserRegister] = useState(false);
    //States for admin event creation
    const [eventModalStatus, setEventModalStatus] = useState(false);
    const [eventUid, setEventUid] = useState('');
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [eventStartTime, setEventStartTime] = useState(new Date());
    const [eventEndTime, setEventEndTime] = useState(new Date());
    const [eventDescription, setEventDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [test, setTest] = useState('');
    //Db Data
    const [dbData, setDBData] = useState([]);
    //Regex Constants
    const letterSpacesAndNumRegex = /^[a-zA-Z\s0-9]*$/;

//Use Effect for Real-Time Current Date check
    useEffect(() => {
        //Calculates time until midnight
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - now.getTime();

        //Update the current date at midnight
        const timeoutId = setTimeout(() => {
            setCurrDate(new Date());
            //Updating the date again at next midnight
            const nextMidnight = new Date(midnight.getTime + 24 * 60 * 60 * 1000);
            const timeUntilNextMidnight = nextMidnight.getTime() - now.getTime();
            setTimeout(() => {
                setCurrDate(new Date());
            }, timeUntilNextMidnight);
        }, timeUntilMidnight);

        return () => clearTimeout(timeoutId);
    }, []);
//////////////////////////////////////////////////

//Format the current date to the proper format to be intaked by Agenda
const formatCurrDate = moment(currDate).format('YYYY-MM-DD');
    
//Creates the days and renders them into an array to be used by Agenda THIS IS THE EVENT CREATION FOR NOW
    useEffect(() => {
        loadItems();
    }, [])
    
    const loadItems = () => {
        //Then load future data being added at real-time
        onSnapshot(scheduleRef, (snapshot) => {
            snapshot.docChanges().forEach(changes => {
                const data = changes.doc.data();
                const strTime = data.eventdate;
                    if (changes.type === 'added') {
                        if (!items[strTime]) { // Keep this code line
                            items[strTime] = []; // Keep
                        }
                
                        items[strTime].push({ // Keep this code line
                            name: data.eventname,
                            time: strTime,
                            eventuid: data.eventuid,
                            starttime: data.starttime,
                            endtime: data.endtime,
                            docid: changes.doc.id
                        });
                    } //else if (changes.type === 'modified') {
                        
                    // } else if (changes.type === 'removed') {

                    // } //Add more different change expressions
            })

            const newItems = {}; // Keep this code line
            Object.keys(items).forEach(key => {
            newItems[key] = items[key];
            });
            setItems(newItems); // Keep this code line
        })
      };
//////////////////////////////////////////////////

//Tester function to check if it sends into the database will use this for when the user actually registers themselves in
      const volunteerReg = async () => {
        let data;
        const userRef = collection(db, 'users');
        const q1 = query(userRef, where("uid", "==", userUID));
        const q2 = query(scheduleRef, where("eventuid", "==", eventUid));

        await getDocs(q1)
            .then((snap) => {
                snap.docs.forEach(doc => {
                    data = doc.data();
                })
            })
            .catch(err => {
                console.error('Error: ', err);
            })

        await getDocs(q2)
            .then(snapshot => {
                snapshot.forEach(document => {
                    const currDocRef = doc(db, 'schedule', document.id);
                    const existingVolunteers = document.data().volunteers || [];
                    const newVolunteers = [
                        ...existingVolunteers,
                        {
                            email: data.email,
                            firstname: data.firstname,
                            lastname: data.lastname,
                            role: data.role,
                            uid: data.uid
                        }
                    ]
                    updateDoc(currDocRef, {
                        volunteers: newVolunteers,
                    })
                    .then(() => {
                        console.log('Successful registration')
                    })
                    .catch(err => {
                        console.log('Error: ', err);
                    })
                })
            })
        setRegisterModalStatus(!registerModalStatus);
      }
//////////////////////////////////////////////////

//Helper close function for modal
      const closeRegisterModal = () => {
        setRegisterModalStatus(false);
      }

      const closeEventModal = () => {
        setEventModalStatus(false);
      }
//////////////////////////////////////////////////

//Event Date & Time Picker functions
      const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
      }

      const toggleStartTimePicker = () => {
        setShowStartTimePicker(!showStartTimePicker);
      }

      const toggleEndTimePicker = () => {
        setShowEndTimePicker(!showEndTimePicker);
      }

      const setDate = (event, selectedDate) => {
        if (event.type === 'set') {
            if (selectedDate) {
                const newDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
                setEventDate(newDate);
                if (Platform.OS === 'android') {
                    toggleDatePicker();
                } else if (Platform.OS === 'ios') {
                    toggleDatePicker();
                }
            }
        } else {
            toggleDatePicker();
        }
      }

      const setStartTime = (event, selectedTime) => {
        if (event.type === 'set') {
            if (selectedTime) {
                const hours = selectedTime.getHours()
                const minutes = selectedTime.getMinutes()
                const newDate = new Date(eventStartTime);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                if (newDate < eventEndTime) {
                    setEventStartTime(newDate);
                    console.log(timeTo24String(eventStartTime))
                    if (Platform.OS === 'android') {
                        toggleStartTimePicker();
                    } else if (Platform.OS === 'ios') {
                        toggleStartTimePicker();
                    }
                } else {
                    console.error('Start time cannot be after end time');
                    toggleStartTimePicker();
                }
            }
        } else {
            toggleStartTimePicker();
        }
      }

      const setEndTime = (event, selectedTime) => {
        console.log(selectedTime)
        if (event.type === 'set') {
            if (selectedTime) {
                const hours = selectedTime.getHours()
                const minutes = selectedTime.getMinutes()
                const newDate = new Date(eventEndTime);
                newDate.setHours(hours);
                newDate.setMinutes(minutes);
                if (newDate > eventStartTime) {
                    setEventEndTime(newDate);
                    if (Platform.OS === 'android') {
                        toggleEndTimePicker();
                    } else if (Platform.OS === 'ios') {
                        toggleEndTimePicker();
                    }
                } else {
                    console.error('End time cannot be before start time');
                    toggleEndTimePicker();
                }
            }
        } else {
            toggleEndTimePicker();
        }

        console.log(eventEndTime);
      }
//////////////////////////////////////////////////

//Function to create events and helpers
const testEmptyString = (string) => {
    if (string.trim() === '' || string === null) {
        return true;
    } else {
        return false;
    }
}

const letterCheck = () => {
    if (letterSpacesAndNumRegex.test(eventName) && letterSpacesAndNumRegex.test(eventDescription)) {
        return true;
    } else {
        return false;
    }
}

//Checks for valid time frame, returns false if the time frame is clear
const checkForTimeFrame = async (date, startTime, endTime) => {
    try {
        const newEventDate = moment(date).format('YYYY-MM-DD');
        const newStartTime = timeTo24String(startTime);
        const newEndTime = timeTo24String(endTime);
        const q = query(scheduleRef, where("eventdate", "==", newEventDate))
        const snapshot = (await getDocs(q));

        let hasConflict = false;

        snapshot.forEach((doc) => {
            const existStartTime = doc.data().starttime;
            const existEndTime = doc.data().endtime;

            if (
                (newStartTime >= existStartTime && newStartTime < existEndTime) ||  // new event starts during existing event
                (newEndTime > existStartTime && newEndTime <= existEndTime) ||      // new event ends during existing event
                (newStartTime <= existStartTime && newEndTime >= existEndTime)      // new event encompasses existing event
            ) {
                console.error('Error: Event time overlaps with an existing event');
                hasConflict = true;
            }
        })

        return hasConflict;
    } catch (err) {
        console.error('Error: ', err);
        return false;
    }
}

const createEvent = async () => {
    if (!testEmptyString(eventName) && !testEmptyString(eventDescription) && letterCheck()) {
        const timeFrameConflict = await checkForTimeFrame(eventDate, eventStartTime, eventEndTime);

        if (!timeFrameConflict) {
            console.log('Creating event');
            const eventuid = uuid.v4();
            addDoc(scheduleRef, 
                { 
                    volunteers: [],
                    eventcreationdate: dateToDateTimeString(currDate),
                    eventdate: dateToFormattedDateString(eventDate),
                    starttime: timeTo24String(eventStartTime),
                    endtime: timeTo24String(eventEndTime),
                    desc: eventDescription,
                    eventname: eventName,
                    eventuid: eventuid,
                })
                .then((doc) => {
                    //Clear states for each thing after successful creation back to default
                    setEventName('');
                    setEventDate(new Date());
                    setEventStartTime(new Date());
                    setEventEndTime(new Date());
                    setEventDescription('');
                    closeEventModal();
                })
                .catch((err) => {
                    console.error('Error: ', err);
                });
        }
    } else {
        console.error('Something went wrong with initializing an event, empty input maybe?');
    }
}

//////////////////////////////////////////////////

//Retrieve data from firebase
    useEffect(() => {
        const q = query(scheduleRef, where('eventuid', '==', eventUid));
        onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                    setDBData(doc.data());
                    const volunteers = doc.data().volunteers;
                    if (volunteers) {
                        volunteers.forEach(volunteer => {
                            setContainsUser(volunteer.uid === userUID);
                        })
                    } else if (volunteers.length === 0) {
                        setContainsUser(false);
                    }
                })
            }
        })

        setUserRegister(containsUser);
    })
//////////////////////////////////////////////////

//Renders the card in for the renderItem option
      const renderItem = (item) => {
        const itemEventUid = item.eventuid;

        const handleItemModal = (eventUid) => {
            setEventUid(eventUid);
            setRegisterModalStatus(!registerModalStatus);
        }

        return (
            <TouchableOpacity onPress={() => handleItemModal(itemEventUid)}>
                <Card>
                    <Card.Content>
                        <View style={styles.card}>
                            <Text>{item.name}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
          );
      }

    return (
        
        <SafeAreaView style={styles.container}>
            <Button style={styles.returnBtn} mode='text' onPress={() => navigation.dispatch(StackActions.pop(1))}>Return</Button>
            <Agenda
                items={items}
                selected={formatCurrDate}
                renderItem={renderItem}
                showOnlySelectedDayItems={true}
            />
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                }}
                behavior='padding'
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                {userRole == 'Admin User' && (
                    <View style={{
                        flex: 1,
                    }}>
                        <View style={styles.addEventContainer}>
                            <IconButton
                                icon={'plus'}
                                size={30}
                                onPress={() => {
                                    setEventModalStatus(!eventModalStatus);
                                }}
                                mode='contained-tonal'
                            />
                        </View>
                        <Modal visible={eventModalStatus} animationType='slide' transparent={true}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                paddingTop: 60,
                                position: 'relative',
                            }}>
                                <View style={{
                                    backgroundColor: 'white',
                                    padding: 15,
                                    width: '80%',
                                    height: '55%',
                                    borderRadius: 10,
                                    flexDirection: 'column',
                                    gap: 10,
                                }}>
                                    <TextInput 
                                        mode='outlined' 
                                        label='Event Name'
                                        onChangeText={eventName => setEventName(eventName)}
                                        style={{
                                            width: '100%',
                                            height: 40,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: 10
                                        }}
                                    >
                                        {showDatePicker && (
                                            <RNDateTimePicker 
                                                mode='date'
                                                value={currDate}
                                                display='spinner'
                                                onChange={setDate}
                                                style={{
                                                    height: 120,
                                                    marginTop: -10
                                                }}
                                            />
                                        )}
                                        {/* IOS DATE PICKER */}
                                        {showDatePicker && Platform.OS === 'ios' && (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-around',
                                                }}
                                            >
                                            <Button
                                                mode='contained'
                                                onPress={setDate}
                                            >
                                                Confirm
                                            </Button>    
                                            <Button
                                                mode='outlined'
                                                onPress={toggleDatePicker}
                                            >
                                                Cancel
                                            </Button>
                                            </View>
                                        )}
                                        <Pressable
                                            onPress={toggleDatePicker}
                                        >
                                            <TextInput 
                                                mode='outlined'
                                                label='Event Date'
                                                value={dateToFormattedDateString(currDate)}
                                                editable={false}
                                                onPressIn={toggleDatePicker}
                                                style={{
                                                    height: 40,
                                                    width: 115
                                                }}
                                            />
                                        </Pressable>

                                        {showStartTimePicker && (
                                            <RNDateTimePicker 
                                                mode='time'
                                                is24Hour={true}
                                                value={eventStartTime}
                                                display='spinner'
                                                onChange={setStartTime}
                                                style={{
                                                    height: 120,
                                                    marginTop: -10
                                                }}
                                            />
                                        )}
                                        {/* IOS START TIME PICKER */}
                                        {showStartTimePicker && Platform.OS === 'ios' && (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-around',
                                                }}
                                            >
                                            <Button
                                                mode='contained'
                                                onPress={setStartTime}
                                            >
                                                Confirm
                                            </Button>    
                                            <Button
                                                mode='outlined'
                                                onPress={toggleStartTimePicker}
                                            >
                                                Cancel
                                            </Button>
                                            </View>
                                        )}
                                        <Pressable
                                            onPress={toggleStartTimePicker}
                                        >
                                            <TextInput 
                                                mode='outlined'
                                                label='Start'
                                                value={timeTo24String(eventStartTime)}
                                                editable={false}
                                                style={{
                                                    height: 40,
                                                    width: 75
                                                }}
                                            />
                                        </Pressable>
                                        {showEndTimePicker && (
                                            <RNDateTimePicker 
                                                mode='time'
                                                is24Hour={true}
                                                value={eventEndTime}
                                                display='spinner'
                                                onChange={setEndTime}
                                                style={{
                                                    height: 120,
                                                    marginTop: -10
                                                }}
                                            />
                                        )}
                                        {/*IOS END TIME PICKER  */}
                                        {showEndTimePicker && Platform.OS === 'ios' && (
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-around',
                                                }}
                                            >
                                            <Button
                                                mode='contained'
                                                onPress={setEndTime}
                                            >
                                                Confirm
                                            </Button>    
                                            <Button
                                                mode='outlined'
                                                onPress={toggleEndTimePicker}
                                            >
                                                Cancel
                                            </Button>
                                            </View>
                                        )}
                                        <Pressable
                                            onPress={toggleEndTimePicker}
                                        >
                                            <TextInput 
                                                mode='outlined'
                                                label='End'
                                                value={timeTo24String(eventEndTime)}
                                                editable={false}
                                                style={{
                                                    height: 40,
                                                    width: 75
                                                }}
                                            />
                                        </Pressable>
                                    </View>
                                    <ScrollView>
                                        <TextInput
                                            mode='outlined'
                                            label='Description'
                                            multiline={true}
                                            onChangeText={eventDescription => setEventDescription(eventDescription)}
                                            contentStyle={{
                                                height: 175,
                                            }}
                                        />
                                    </ScrollView>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                    }}>
                                        <TouchableOpacity onPress={createEvent} style={[styles.registerBtn, {
                                            backgroundColor: '#2196F3',
                                            justifyContent: 'flex-end',
                                            marginRight: '10%'
                                        }]}>
                                            <Text style={{
                                                color: '#f0efed',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>
                                                Confirm
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={closeEventModal} style={[styles.registerBtn, {
                                            backgroundColor: '#f54242',
                                            justifyContent: 'flex-end',
                                            alignItems: 'flex-end',
                                            marginRight: '10%'
                                        }]}>
                                            <Text style={{
                                                color: '#f0efed',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>
                                                Close
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )}
                    <Modal visible={registerModalStatus} animationType='slide' transparent={true}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            paddingTop: 60,
                            height: '100%',
                            width: '100%',
                        }}>
                            <View style={{
                                backgroundColor: 'white',
                                alignItems: 'center',
                                padding: 15,
                                width: '60%',
                                height: '40%',
                                borderRadius: 10,
                                flexDirection: 'column',
                                gap: 5,
                            }}>
                                <View style={{
                                    backgroundColor: '#2e2d2b',
                                    width: '110%',
                                    height: '80%',
                                    borderRadius: 10,
                                    padding: 10,
                                    flexDirection: 'column',
                                    gap: 10,
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                    }}>
                                        <View style={{
                                            backgroundColor: '#f5d142',
                                            width: 'auto',
                                            borderRadius: 10,
                                            padding: 10,
                                        }}>
                                            <Text style={{
                                                color: 'black',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>
                                                {dbData.eventname}
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: 'white',
                                            width: 'auto',
                                            borderRadius: 10,
                                            padding: 10,
                                        }}>
                                            <Text style={{
                                                color: 'black',
                                                fontSize: 15,
                                            }}>
                                                {dbData.starttime}
                                            </Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: 'white',
                                            width: 'auto',
                                            borderRadius: 10,
                                            padding: 10,
                                        }}>
                                            <Text style={{
                                                color: 'black',
                                                fontSize: 15,
                                            }}>
                                                {dbData.endtime}
                                            </Text>
                                        </View>
                                    </View>
                                    <ScrollView centerContent={true} scrollEnabled={true}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                    }}
                                    style={{
                                        backgroundColor: 'white',
                                        width: '100%',
                                        height: '60%',
                                        borderRadius: 10,
                                        padding: 10,
                                    }}>
                                            <Text>{dbData.desc}</Text>
                                    </ScrollView>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    gap: 10,
                                }}>
                                    {!userRegister ? 
                                        (<TouchableOpacity style={[styles.registerBtn, {
                                            width: 125,
                                            height: 50,
                                            backgroundColor: '#2196F3',
                                        }]} onPress={volunteerReg}>
                                            <Text style={{
                                                color: '#f0efed',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>
                                                Register
                                            </Text>
                                        </TouchableOpacity>)
                                        :
                                        (<View style={[styles.registerBtn, {
                                            width: 125,
                                            height: 50,
                                            backgroundColor: '#2e2d2b',
                                        }]}>
                                            <Text style={{
                                                color: '#f0efed',
                                                fontSize: 15,
                                                fontWeight: 'bold'
                                            }}>
                                                Registered
                                            </Text>
                                        </View>)
                                    }
                                    <TouchableOpacity onPress={closeRegisterModal} style={[styles.registerBtn, {
                                        backgroundColor: '#f54242',
                                        width: 75,
                                        height: 50,
                                    }]}>
                                        <Text style={{
                                            color: '#f0efed',
                                            fontSize: 15,
                                            fontWeight: 'bold'
                                        }}>
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const formatted24TimeToDateObject = (time) => {
    if (time) {
        const formattedDate = time.split(':');
        const dateObj = new Date();

        dateObj.setHours(parseInt(formattedDate[0]), parseInt(formattedDate[1]), 0, 0)

        return dateObj;
    }
}

const timeToAMPMString = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

const timeTo24String = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes}`;
}

const dateToDateTimeString = (time) => {
    const date = new Date(time);
    return moment(date).format('YYYY-MM-DD HH:mm');
}

const dateToFormattedDateString = (time) => {
    const date = new Date(time);
    return moment(date).format('YYYY-MM-DD');
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    },
    registerBtn: {
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    returnBtn: {
        marginTop: '5%'
    },
    addEventContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        flexDirection: 'column-reverse',
    },
});

export default Schedule;