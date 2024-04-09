import {Text} from 'react-native';
import { useFonts } from 'expo-font';
import AppLoading from "expo-app-loading"

function Title({text, color}) {

  const [fontsLoaded] = useFonts({
    'LeckerliOne': require('./../assets/fonts/LeckerliOne-Regular.ttf'),
  });
  if (!fontsLoaded){
    return <AppLoading/>
  }

  return (
    <Text
      style={{
        color: color,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: 'LeckerliOne',
      }}>
      {text}
    </Text>
  );
}

export default Title;
