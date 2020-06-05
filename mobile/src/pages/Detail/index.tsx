import React, {useEffect, useState } from 'react'
import { View, Text, Image , SafeAreaView, Linking} from 'react-native'
import { useRoute} from '@react-navigation/native'
import styles from  './styles'
import ButtonBack from './../../Component/ButtonBack'
import { RectButton} from 'react-native-gesture-handler'
import {Feather as Icon, FontAwesome} from '@expo/vector-icons'
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api'
interface Params {
    point_id: number;
}

interface Data {
    point: {
        image:string;
        image_url: string;
        name:string;
        email:string;
        whatsapp:string;
        city:string;
        uf:string;
    };
    items: {
        title: string;
    }[]
}
const Detail = () =>
{
    const route = useRoute();
    const routeParams = route.params as Params;
    const [data, setData] = useState<Data>({} as Data);

    useEffect(() => {
            api.get(`points/${routeParams.point_id}`).then(response => {
                setData(response.data);
            })
    },[])

    function handleComposeMail(){
        MailComposer.composeAsync({
            subject: 'Interesse na coleta de residuos',
            recipients: [data.point.email]
        })
    }

    function handleWhatsapp(){
        Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Teste Bruno xarabas`);       
    }

    if(!data.point)
    {
        //fazer tela de load
        return null;
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <View style={styles.container}>
                <ButtonBack />

                <Image style={styles.pointImage} source={{uri: data.point.image_url}} />

                <Text style={styles.pointName}>{data.point.name}</Text>
                <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Endereço</Text>
                     <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button} onPress={handleWhatsapp}>
                    <FontAwesome name='whatsapp' size={30} color='#FFF' />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button} onPress={handleComposeMail}>
                    <Icon name='mail' size={30} color='#FFF' />
                    <Text style={styles.buttonText}>E-Mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
         )
}

export default Detail