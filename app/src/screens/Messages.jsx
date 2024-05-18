import React, { useEffect, useState } from "react";
import {
  Keyboard,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Text } from "react-native";
import Thumbnail from "../common/Thumbnail";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useGlobal from "../core/global";

const MessageInput = ({ message, setMessage, onSend }) => {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Message..."
        placeholderTextColor="#909090"
        value={message}
        onChangeText={setMessage}
        style={{
          flex: 1,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderRadius: 15,
          borderColor: "#d0d0d0",
          backgroundColor: "white",
          height: 50,
        }}
      />
      <TouchableOpacity onPress={onSend}>
        <FontAwesomeIcon
          icon="paper-plane"
          size={22}
          color="#303040"
          style={{
            marginHorizontal: 12,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const MessageHeader = ({ friend }) => {
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
};

const MessagesScreen = ({ navigation, route }) => {
  const [message, setMessage] = useState("");

  const messageSend = useGlobal(state => state.messageSend)
  
  const friend = route.params.friend;
  const connectionId = route.params.id

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <MessageHeader friend={friend} />,
    });
  }, [navigation, friend]);

  function onSend() {
    const cleaned = message.replace(/\s+/g, ' ').trim()
    console.log("onSend:",cleaned);
    if (cleaned.length === 0) return;
    messageSend(connectionId, cleaned)
    setMessage(""); 
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            borderWidth: 6,
            borderBlockColor: "red",
          }}
        ></View>
      </TouchableWithoutFeedback>
      <MessageInput message={message} setMessage={setMessage} onSend={onSend} />
    </SafeAreaView>
  );
};

export default MessagesScreen;
