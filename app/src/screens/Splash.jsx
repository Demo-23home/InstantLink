import {SafeAreaView, StatusBar, Text, View} from 'react-native';
function SplashScreen() {
  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black',
      }}>
      <StatusBar barStyle="light-content" />
      <View>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 48,
          }}>
          Realtime Chat
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default SplashScreen;
