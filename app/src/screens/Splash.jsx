import {SafeAreaView, StatusBar, Animated} from 'react-native';
import { useLayoutEffect } from 'react';

import {useEffect} from 'react';
import Title from '../common/Title';

function SplashScreen({navigation}) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const translateY = new Animated.Value(0);
  const duration = 800;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 20,
          duration: duration,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
      }}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[{transform: [{translateY}]}]}>
        <Title text="Realtime Chat" color="white" />
      </Animated.View>
    </SafeAreaView>
  );
}

export default SplashScreen;
