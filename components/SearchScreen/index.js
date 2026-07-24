import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { ScrollView,StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { GoogleGenAI } from "@google/genai";
import TextRecognition from "@react-native-ml-kit/text-recognition";

const { width } = Dimensions.get('window');
const ai = new GoogleGenAI({
    apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY
});

async function buscarTexto(card) {
    try {
        const interaction = await ai.interactions.create({
            model: 'gemini-3.5-flash',
            input: [
                {
                    type: 'text',
                    text: `resuma brevemente em até 100 caracteres a carta de magic ${card} `,
                },
            ],
        });
        console.log(interaction.output_text);
        return interaction.output_text || interaction.text || "Estrutura de resposta inesperada.";

    } catch (error) {
        console.error('Erro crítico ao chamar a API Gemini:', error);
        return `Erro na API: ${error.message || error}`;
    }
}


const cameraHeight = width * (4 / 3);

export default function SearchScreen({}) {
    const navigation = useNavigation();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cardName, setCardName] = useState(null);
    const [cardText, setCardText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [okOn, setOkOn] = useState(false);
    const [textIsFull, setTextIsFull] = useState(false);

    const searchByName = async () => {
        try {
            setTextIsFull(true);
            setIsLoading(true);
            const resultIA = await buscarTexto(cardName);
            console.log(resultIA);
            setCardText(resultIA);
        } catch (error) {
            console.error("erro com o nome da carta", error);
            setCardText("Erro ao processar o nome da carta.");
        } finally {
            setIsLoading(false);
        }
        };

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
        if (cameraRef.current) {
            try {
                setIsLoading(true);

                const options = { quality: 0.8, skipProcessing: false };
                const data = await cameraRef.current.takePictureAsync(options);
                setIsCameraActive(false);
                setTextIsFull(true);
                // Dispara o reconhecimento do texto
                const textResult = await TextRecognition.recognize(data.uri);
                const strings = textResult.text.split('\n');
                const resultPhoto = await buscarTexto(strings[0])
                setCardText(resultPhoto);

            } catch (error) {
                console.error("Erro ao tirar foto:", error);
                setCardText("Não foi possível capturar a foto da câmera.");
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {textIsFull ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    {isLoading ? (
                        <Text style={styles.text}>Analisando sua carta...</Text>
                    ) : (
                        <ScrollView style={{  }}>
                            <Text style={styles.text}>{cardText || "Nenhum texto retornado."}</Text>
                            <Button
                                title="Buscar outra carta"
                                onPress={() => {
                                    setPhoto(null);
                                    setCardText(null);
                                    setTextIsFull(false);
                                }}
                            />
                        </ScrollView>
                    )}
                </View>
            ) : (
                <>
                    {isCameraActive && (
                        <View style={styles.cameraWrapper}>
                            <CameraView
                                style={styles.cameraViewComponent}
                                facing={facing}
                                ref={cameraRef}
                                mode="picture"
                                responsiveOrientationWhenOrientationChanged={true}
                            />
                        </View>
                    )}

                    <SafeAreaView style={styles.overlayContainer}>
                        <View style={styles.inputView}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => {
                                    if (isCameraActive) {
                                        setIsCameraActive(false);
                                    } else {
                                        navigation.goBack();
                                    }
                                }}
                            >
                                <Text style={styles.backButtonText}>✕</Text>
                            </TouchableOpacity>

                            <TextInput
                                placeholder={'Carta'}
                                placeholderTextColor={'rgba(255,255,255,0.6)'}
                                style={styles.input}
                                onChangeText={(text) => {
                                    setCardName(text);
                                    setOkOn(text.trim().length > 0);
                                }}
                            />

                            {!okOn ? (
                                <TouchableOpacity
                                    style={styles.buttonAction}
                                    onPress={handleActivateCamera}
                                >
                                    <Image
                                        style={styles.image}
                                        source={require('../../assets/camera.png')}
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.okButton}
                                    onPress={searchByName}
                                >
                                    <Text style={styles.okButtonText}>OK</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {isCameraActive && (
                            <TouchableOpacity style={styles.teste} onPress={takePicture}>
                                <Image
                                    style={styles.imagePhoto}
                                    source={require('../../assets/circulo.png')}
                                />
                            </TouchableOpacity>
                        )}
                    </SafeAreaView>
                </>
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
    cameraWrapper: {
        position: 'absolute',
        width: width,
        height: cameraHeight,
        overflow: 'hidden',
        alignSelf: 'center',
        zIndex: 1,
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
        marginBottom: 100,
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
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    imagePhoto: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    }
});
