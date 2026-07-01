import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



export default function HomeScreen({navigation}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}
                              style={styles.scrButtons}
            >
                <Text style={styles.textButtons}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('DeckScreen')}
                              style={styles.scrButtons}
            >
                <Text style={styles.textButtons}>Deck</Text>
            </TouchableOpacity>

            <StatusBar></StatusBar>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrButtons: {
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'white',
        padding: 40,

        width: '90%',
        alignItems: 'center',
        marginBottom: 40,

    },
    textButtons: {
        fontSize: 15,
        color: 'white',
    }
});
