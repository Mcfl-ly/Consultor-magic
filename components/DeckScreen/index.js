import { StatusBar } from 'expo-status-bar';
import {useState, useRef, useCallback} from 'react';
import {
    ScrollView,
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Image,
    Button,
    Dimensions,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { GoogleGenAI } from "@google/genai";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import * as SQLite from "expo-sqlite";

const { width } = Dimensions.get('window');
const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY
});

export const db = SQLite.openDatabaseSync("decks")

const cameraHeight = width * (4 / 3);

export default function SearchScreen({ route }) {

    const {deckName} = route.params;


    const navigation = useNavigation();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [cardName, setCardName] = useState(null);
    const [okOn, setOkOn] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cards, setCards] = useState([]);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [qtd, setQtd] = useState(1);
    const [deletedCard, setDeletedCard] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    useFocusEffect(
        useCallback(() => {
            listarCartas();
        }, [])
    );


    async function insertCards(nomeDeck, cards) {
        try {
            console.log("carta:", JSON.stringify(cards))
            await db.withTransactionAsync(async () => {
                for (const card of cards) {
                    console.log("Carta recebida:", card);
                    await db.runAsync(
                        `INSERT INTO "${nomeDeck}" (nome, quantidade, uri)
                     VALUES (?, ?, ?)
                     ON CONFLICT(nome)
                     DO NOTHING;`,
                        [
                            card.name,
                            card.qtd,
                            card.photo
                        ]
                    );
                }
            });

        } catch (error) {
            console.error("Erro ao inserir cartas:", error);
        }
    }

    async function listarCartas() {
        try {
            const resultado = await db.getAllAsync(`SELECT * FROM "${deckName}"`);
            setCards(resultado.map(item => ({
                name: item.nome,
                photo: item.uri,
                qtd: item.quantidade,
            })));

        } catch (error) {
            console.log(error);
        }
    }


    const handleActivateCamera = async () => {
        if (!permission || !permission.granted) {
            const response = await requestPermission();
            if (response.granted) {
                setIsCameraActive(true);
            }
        } else {
            setIsCameraActive(true);
        }
    };

    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            const data = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                skipProcessing: false,
            });

            setIsCameraActive(false);
            setPreviewPhoto(data.uri); // mostra a foto
        } catch (error) {
            console.error(error);
        }
    };

    const confirmPhoto = async () => {
        try {
            setIsLoading(true);

            const textResult = await TextRecognition.recognize(previewPhoto);
            const strings = textResult.text.split("\n");

            setCards(cards => [
                {
                    name: strings[0],
                    photo: previewPhoto,
                    qtd: qtd,
                },
                ...cards,
            ]);

            setPreviewPhoto(null);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const retakePhoto = () => {
        setPreviewPhoto(null);
        setIsCameraActive(true);
    };

    async function deleteCard() {
        const newCards = cards.filter(card => card.name !== deletedCard);
        setCards(newCards);

        try {
            await db.runAsync(`DELETE FROM "${deckName}" WHERE nome = "${deletedCard}"`);
            setShowMenu(false);
        } catch (error) {
            console.error(error);
        }

        console.log(cards)
    }
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* ================= PREVIEW ================= */}
            {previewPhoto ? (
                <SafeAreaView style={styles.container}>
                    <TextInput style={styles.textInput}
                               placeholder={"Quantidade"}
                               placeholderTextColor={"black"}
                               onChangeText={(text) => setQtd(parseInt(text))}
                    ></TextInput>
                    <Image
                        source={{ uri: previewPhoto }}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />

                    <View style={styles.previewButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={retakePhoto}
                        >
                            <Text style={styles.buttonText}>Refazer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={confirmPhoto}
                        >
                            <Text style={styles.buttonText}>Usar Foto</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

            ) : isCameraActive ? (

                /* ================= CÂMERA ================= */

                <>
                    <View style={styles.cameraWrapper}>
                        <CameraView
                            style={styles.cameraViewComponent}
                            facing={facing}
                            ref={cameraRef}
                            mode="picture"
                            responsiveOrientationWhenOrientationChanged
                        />
                    </View>

                    <SafeAreaView style={styles.overlayContainer}>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setIsCameraActive(false)}
                        >
                            <Text style={styles.backButtonText}>✕</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.teste}
                            onPress={takePicture}
                        >
                            <Image
                                style={styles.imagePhoto}
                                source={require("../../assets/circulo.png")}
                            />
                        </TouchableOpacity>

                    </SafeAreaView>
                </>

            ) : (

                /* ================= LISTA ================= */

                <SafeAreaView style={styles.overlayContainer}>

                    <View style={styles.inputView}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>✕</Text>
                        </TouchableOpacity>

                        <Text style={{color: "white", fontSize: 20}}>{deckName}</Text>

                        {!okOn ? (
                            <TouchableOpacity
                                style={styles.buttonAction}
                                onPress={handleActivateCamera}
                            >
                                <Image
                                    style={styles.image}
                                    source={require("../../assets/camera.png")}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={() => console.log("OK")}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {cards.map((card, index) => (
                            <View key={index} style={styles.cardsView}>
                                <TouchableOpacity
                                    onLongPress={() => {
                                        setDeletedCard(card.name)
                                        setShowMenu(true)
                                    }}
                                    onPress={() => setSelectedCard(card)}
                                    delayLongPress={600}
                                >
                                    <Text style={styles.text}>
                                        {card.name}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                        ))}

                    </ScrollView>
                    <Modal
                        visible={showMenu}
                        transparent
                        animationType="fade">

                        <View
                            style={styles.overlayCard}>

                            <View style={styles.menu}>
                                <Text style={styles.title}>{deletedCard}</Text>

                                <TouchableOpacity onPress={() => {
                                    deleteCard();}}>
                                    <Text style={styles.renameDelCancel}>Excluir</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setShowMenu(false)}>
                                    <Text style={styles.renameDelCancel}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                            insertCards(deckName, cards)
                        }}>
                        <Text style={styles.text}>Salvar</Text>
                    </TouchableOpacity>
                    <Modal
                        visible={selectedCard !== null}
                        transparent
                        animationType="fade"
                    >
                        <Pressable
                            style={styles.overlay}
                            onPress={() => setSelectedCard(null)}
                        >
                            {selectedCard && (
                                <>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={`Quantidade atual: ${selectedCard.qtd}`}
                                        placeholderTextColor="black"
                                        keyboardType="numeric"
                                    />

                                    <Image
                                        source={{ uri: selectedCard.photo}}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                </>
                            )}
                        </Pressable>
                    </Modal>

                </SafeAreaView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    previewImage: {
        flex: 1,
        width: "100%",
    },
    addButton: {
        marginBottom: 30,
        borderWidth: 1,
        borderColor: "white",
        width: "50%",
        alignSelf: "center",
    },
    previewButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingVertical: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d9534f',
    },
    confirmButton: {
        flex: 1,
        marginLeft: 10,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#28a745',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraWrapper: {
        position: 'absolute',
        width: width,
        height: cameraHeight,
        overflow: 'hidden',
        alignSelf: 'center',
        zIndex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },

    scrollView: {
        marginTop: 50,
    },
    cardsView: {
        borderWidth: 1,
        borderColor: 'white',
    },
    teste: {
        flex: 1,
        justifyContent: 'flex-end',
        position: 'absolute',
        bottom: 35,
        alignSelf: 'center',
        zIndex: 10,
    },
    text: {
        color: 'white',
        fontSize: 20,
        lineHeight: 40,
        textAlign: 'center',

    },
    cameraViewComponent: {
        flex: 1,
    },
    cameraPreview: {
        flex: 1,
        resizeMode: 'contain',
    },
    overlayContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        zIndex: 2,
    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 45,
    },
    backButton: {
        marginRight: 12,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        height: 46,
        width: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    okButton: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        height: 46,
        width: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginLeft: 12,
    },
    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    okButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        height: 46,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        color: 'white',
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    buttonAction: {
        marginLeft: 12,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 6,
        height: 46,
        width: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
        image: {
            width: "90%",
            height: "80%",
        },
    imagePhoto: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    textInput: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFF",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: 'black',
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
    overlayCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    }}
    );
