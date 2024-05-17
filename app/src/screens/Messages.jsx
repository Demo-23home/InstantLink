import React, { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import { Text } from "react-native";
import Thumbnail from "../common/Thumbnail";

function MessageHeader({ friend }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Thumbnail url={friend.thumbnail} size={30} />
      <Text
        style={{
          color: "#202020",
          marginLeft: 10,
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {friend.name}
      </Text>
    </View>
  );
}

const MessagesScreen = ({ navigation, route }) => {
  // Update the header
  const friend = route.params.friend;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <MessageHeader friend={friend}/>
      ) ,
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>meassage</Text>
    </SafeAreaView>
  );
};

export default MessagesScreen;
