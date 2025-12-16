import React from 'react';  
import { View, Text, StyleSheet , TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export default function Markstatement({navigation}){

    const handleBackPress = () => {  
        navigation.goBack();   
    }


    return(
        <View>
            <Text onPress={handleBackPress}>go  back</Text>
            <Text>your mark statement here ...</Text>
        </View>
    )
}
