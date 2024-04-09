import { Text, StyleSheet, Pressable, Animated } from 'react-native';
import {useState} from 'react';


export function ButtonAnimatedWithChild({ child, onPress, style}) {
    const [opacity] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }).start();
      };
    
      const handlePressOut = () => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }).start();
        onPress();
      };

      return (<Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
        style={{ ...styles.UpcomingPressable, ...style }}
    >
    <Animated.View style={{ ...styles.Container, opacity }}>
        {child}
    </Animated.View>
    </Pressable>)
}

export function ButtonAnimatedWithLabel({ label, onPress, style, styleText}) {
    return (
        <ButtonAnimatedWithChild
        child={<Text style={{...styles.Text, ...styleText}}>{label}</Text>}
        onPress={onPress}
        style={style}
        />
    )
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#069A8E',
        shadowColor: 'grey',
        shadowOffset: {
          width: 2,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 5,
        width: '90%',
      },
      Text: {
        color: '#ffffff',
        fontSize: 16,
        marginLeft: 10,
      },
      UpcomingPressable: {
        width: '100%',
        alignItems: 'center',
      },
});