import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { db } from '../../Firebase/firebaseConfig'; 
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { StackActions } from '@react-navigation/native';

const FoodInput = ({ navigation }) => {
    const [food, setFood] = useState('');
    const [foodList, setFoodList] = useState([]);

    // Function to add food to the database
    const handleAddFood = async () => {
        try {
            const itemsRef = collection(db, 'food');
            const docRef = await addDoc(itemsRef, { name: food });
            console.log(`Food added with ID: ${docRef.id}`);
            const newFoodItem = { id: docRef.id, name: food };
            setFoodList(prevFoodList => [...prevFoodList, newFoodItem]);
            setFood('');
        } catch (e) {
            console.error("Error adding food: ", e);
        }
    };

    // Function to fetch food from the database
    useEffect(() => {
        const fetchFood = async () => {
            const foodCollection = collection(db, 'food');
            const foodSnapshot = await getDocs(foodCollection);
            const foodList = foodSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setFoodList(foodList);
        };

        fetchFood();
    }, []);

    // Function to clear the entered options
    const clearOptions = () => {
        setFoodList([]);
    };

    return (
        <View style={styles.container}>
            <TextInput   
                style={styles.input}
                placeholder="Enter food here"
                value={food}
                onChangeText={setFood}
                placeholderTextColor="#6B7280" 
            />
            <TouchableOpacity style={styles.button} onPress={handleAddFood}>
                <Text style={styles.buttonText}>Enter Your Suggestion!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.buttonBlockTwo} onPress={() => {
    const recentOptions = foodList.slice(0, 3);
    navigation.navigate('Polling', { recentOptions: recentOptions });
}}>
    <Text style={styles.buttonText}>Polling</Text>
</TouchableOpacity>
           
            
            <FlatList
                data={foodList}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listItemText}>{item.name}</Text>
                    </View>
                )}
            />





            <TouchableOpacity style={styles.clearButton} onPress={clearOptions}>
                <Text style={styles.clearButtonText}>Clear Options</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.returnButton} onPress={() => navigation.dispatch(StackActions.pop(1))}>
                <Text style={styles.returnButtonText}>Return</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    
    buttonBlockTwo: {
        backgroundColor: '#34D399', // A different color to make the button stand out
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        alignSelf: 'center', // Center the button in the view
        width: '90%', // Use a width that fits the screen
    },
    
    
    
    container: {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: '#F9FAFB', 
        padding: 16,
    },
    input: {
        borderColor: '#D1D5DB', 
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: '#FFFFFF', 
        fontSize: 16,
    },
    button: {
        backgroundColor: '#10B981', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#FFFFFF', 
        fontWeight: '600', 
        fontSize: 16,
    },
    clearButton: {
        backgroundColor: '#EF4444', 
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    clearButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    listItem: {
        backgroundColor: '#E5E7EB',
        padding: 12,
        marginVertical: 8,
        borderRadius: 8,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginHorizontal: 16,
    },
    listItemText: {
        color: '#111827', 
        fontSize: 16,
    },
    returnButton: {
        backgroundColor: '#3B82F6', 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
    },
    returnButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default FoodInput;