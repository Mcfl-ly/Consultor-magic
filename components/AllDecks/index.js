import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from 'expo-sqlite';
import {useState} from "react";


export const db = SQLite.openDatabaseSync("decks.database")


export default function AllDecks({navigation}) {

    const [deckName, setDeckName] = useState('');
    const [showInput, setShowInput] = useState(false);


    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                        navigation.goBack();
                    }
                }
            >
                <Text style={styles.backButtonText}>✕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                console.log("foi");
                console.log(showInput);
                setShowInput(true)}}
                              style={styles.scrButtons}
            >
                <Text style={styles.textButtons}>Adicionar Deck</Text>
            </TouchableOpacity>
            </View>
            <Modal
                visible={showInput}
                transparent
                animationType="fade"
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '80%',
                        }}
                    >
                        <TextInput
                            placeholder="Nome do deck"
                            value={deckName}
                            onChangeText={setDeckName}
                            style={{
                                borderWidth: 1,
                                padding: 10,
                                marginBottom: 15,
                            }}
                        />
                        <View style={styles.buttons}>
                        <Button
                            title="Criar"
                            onPress={() => {
                                setShowInput(false);

                                navigation.navigate('DeckScreen', {
                                    deckName,
                                });
                            }}
                        />
                        <Button
                            title="Voltar"
                            onPress={() => {
                                setDeckName('');
                                setShowInput(false);
                            }}
                        />

                        </View>
                    </View>
                </View>
            </Modal>

            <StatusBar></StatusBar>
        </View>

    );
}
// GUARDAR LINHA IMPORTANTE AQ navigation.navigate('DeckScreen')
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
    },
    scrButtons: {
        borderRadius: 10,
        borderWidth: 3,
        borderColor: 'white',
        padding: 20,

        width: '50%',
        alignItems: 'center',
        marginLeft: 10,


    },
    textButtons: {
        fontSize: 15,
        color: 'white',
    },
    backButton: {
        marginRight: 0,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 6,
        padding: 20,
        width: "17%",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});