import React, {useState} from 'react'
import { Feather as Icone } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation} from '@react-navigation/native'
import styles from  './styles'


const Home = () =>
{
    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

const navigation = useNavigation();

function handleNavigateToPoints(){
  navigation.navigate('Points', {
      uf,
      city
  })
}

    return (
        <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined }>
        <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{width: 274, height:368}}     
       >
                <View style={styles.main}>
                     <Image source={require('../../assets/logo.png')} />
                     <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos </Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                     </View>                   
                </View>

                <View style={styles.footer}>
                    <TextInput style={styles.input}  placeholder="UF" value={uf} onChangeText={setUf} />
                    <TextInput style={styles.input} placeholder="Cidade"  value={city} onChangeText={setCity}/>

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                           <Text> 
                                <Icone name="arrow-right" color="#FFF" size={24} />                              
                             </Text> 
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>


                    </RectButton>
                </View>

         </ImageBackground>
         </KeyboardAvoidingView>
    )
}

export default Home