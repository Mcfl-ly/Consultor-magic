import { StatusBar } from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal, ScrollView} from 'react-native';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from 'expo-sqlite';
import {useCallback, useState} from "react";


export const db = SQLite.openDatabaseSync("decks")


export default function AllDecks({navigation}) {

    const [deckName, setDeckName] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [decks, setDecks] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);


    useFocusEffect(
        useCallback(() => {
            listarTabelas();
        }, [])
    );
    async function criarDeck(nomeDeck) {
        try {
            console.log(nomeDeck);
            await db.runAsync(`
            CREATE TABLE IF NOT EXISTS "${nomeDeck}" (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT UNIQUE NOT NULL,
                quantidade INTEGER NOT NULL,
                uri TEXT
            );
        `);
            setDeckName('')

            // Atualiza a lista de decks
            await listarTabelas();

        } catch (error) {
            console.error(error);
        }
    }
    async function listarTabelas() {
        try {
            const resultado = await db.getAllAsync(
                `SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence' ORDER BY name;`
            );

            setDecks(resultado.map(item => item.name));
        } catch (error) {
            console.error(error);
        }
    }

    async function deleteDeck(name) {
        try {
            await db.runAsync(`DROP TABLE "${name}"`);
            listarTabelas();
            setShowMenu(false);
        } catch (error) {
            console.error(error);
        }
    }

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

            <ScrollView style={styles.scrollView}>
                {decks.map((deck, index) => (
                    <View key={index} style={styles.cardsView}>
                        <TouchableOpacity
                        onPress={() => {
                            console.log(deck);
                            navigation.navigate('DeckScreen', {
                                deckName: deck
                            });
                        }}
                        onLongPress={() => {
                            setSelectedDeck(deck);
                            setShowMenu(true);
                            console.log(deck);
                        }}
                        delayLongPress={600}>
                            <Text style={styles.deckTitle}>{deck}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/*MODAL DE EXCLUIR DECK*/}
            <Modal
                visible={showMenu}
                transparent
                animationType="fade">

                <View
                    style={styles.overlay}>

                    <View style={styles.menu}>
                        <Text style={styles.title}>{selectedDeck}</Text>

                        <TouchableOpacity
                        >
                            <Text style={styles.renameDelCancel}>Renomear</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            console.log(selectedDeck);
                            deleteDeck(selectedDeck)}}>
                            <Text style={styles.renameDelCancel}>Excluir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setShowMenu(false)}>
                            <Text style={styles.renameDelCancel}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>



            {/*MODAL DE ADICIONAR DECK*/}
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
                        <TouchableOpacity
                            onPress={() => {
                                setShowInput(false);
                                criarDeck(deckName);
                                navigation.navigate('DeckScreen', {
                                    deckName,
                                });
                            }}
                        >
                            <Text style={styles.createButton}>CRIAR</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setDeckName('');
                                setShowInput(false);
                            }}
                        >
                            <Text style={styles.cancelButton}>VOLTAR</Text>
                        </TouchableOpacity>

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
    },
    scrollView: {
        marginTop: 50,
    },
    deckTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    menu: {
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    renameDelCancel: {
        alignSelf: 'center',
        fontSize: 20,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 15,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
    createButton: {
        fontSize: 15,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
    },
    cancelButton: {
        fontSize: 15,
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 20
    }
});