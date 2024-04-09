import { StyleSheet, Text, View, TextInput } from 'react-native';
import {useState, useEffect} from 'react';
import { ButtonAnimatedWithChild } from '../CommonComponents/ButtonAnimated';
import {apiRoute} from '../makeRequest';

export default function Login({navigation, route}) {
    const [meterID, setMeterID] = useState(null);
    const [password, setPassword] = useState(null);
    const [showError, setShowError] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const handlePress = () => {
        // post request to the api http://localhost:3030/household/meterID with the body {password: password}
        console.log(meterID, password)
        console.log(apiRoute)

        if (meterID === null || password === null) {
            setShowError(true);
            return;
        }

        fetch(`${apiRoute}/login/${meterID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, meterID})
        }).then(response => {
            console.log(response)
            if (response.ok) {
                console.log("Login successful")
                setShowError(false);
                setIsLoginSuccess(true);
            } else {
                console.log("Login failed")
                setShowError(true);
            }
        }
        ).catch(error => {
            console.log("Error: ", error);
        });
    }
    
    useEffect(() => {
        if (isLoginSuccess) {
            // navigate to the dashboard
            var passObj = {meterID, password, apiRoute}
            navigation.navigate('Dashboard', passObj);
        }
    }, [isLoginSuccess])


    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput style={styles.textInputStyle} placeholder="MeterID"  onChangeText={(text) => setMeterID(text)}/>
            <TextInput style={styles.textInputStyle} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>
            <ButtonAnimatedWithChild child={
                <Text style={styles.PressableText}>Login</Text>} 
                onPress={handlePress} 
                style={styles.PressableContainer}/>
            {showError && <Text style={styles.errorText}>Invalid username or password</Text>}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputStyle: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        padding: 5,
        
    },
    PressableContainer: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 250,
    },
    PressableText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
    }
});
