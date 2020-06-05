import React from 'react'
import { View , TouchableOpacity } from 'react-native'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation} from '@react-navigation/native'

const ButtonBack = () => 
{
    const navigation = useNavigation();

    function hangleNavigateBack(){
        navigation.goBack()
    }

    return (
        <View>
             <TouchableOpacity onPress={hangleNavigateBack}>
                <Icon name="arrow-left" size={20} color="#34CB79"/>
             </TouchableOpacity>
        </View>
    )
}

export default ButtonBack
