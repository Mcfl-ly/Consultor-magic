import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Button, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const cameraHeight = width * (4 / 3);

export default function SearchScreen({}) {
    const navigation = useNavigation();
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);
    const cameraRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cardName, setCardName] = useState(null);

    // const toggleCameraFacing = () => {
    //     setFacing(current => (current === 'back' ? 'front' : 'back'));
    // };

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
        // EXIBE A FOTO AQUI
    // if (photo) {
    //     return (
    //         <View style={styles.container}>
    //             <Image source={{ uri: photo }} style={styles.cameraPreview} />
    //             <Button title="Tirar outra foto" onPress={() => setPhoto(null)} />
    //         </View>
    //     );
    // }

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 1, skipProcessing: false };
            const data = await cameraRef.current.takePictureAsync(options);
            setPhoto(data.uri);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

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
                        onChangeText={setCardName}
                    />

                    {!cardName ? (
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
                            onPress={() => {
                                if (isCameraActive) {
                                    setIsCameraActive(false);
                                } else {
                                    navigation.goBack();
                                }
                            }}
                        >
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.teste}
                    onPress={takePicture}
                >
                    <Image
                        style={styles.imagePhoto}
                        source={require('../../assets/circulo.png')}
                    />
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center', // Centraliza a caixa da câmera verticalmente na tela
    },
    cameraWrapper: {
        position: 'absolute',
        width: width,
        height: cameraHeight, // Força a proporção real 4:3
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
