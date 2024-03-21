import {SafeAreaView, StatusBar, View} from 'react-native';
import Title from '../common/Title';
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
        <Title text="Realtime Chat" color="white" />
      </View>
    </SafeAreaView>
  );
}

export default SplashScreen;
