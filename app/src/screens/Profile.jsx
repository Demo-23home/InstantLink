import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import useGlobal from "../core/global";
import utils from "../core/utils";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker"; // Correct import

function ProfileImage() {
  const [image, setImage] = useState(null);

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true, // Include base64 representation
    });

    if (!result.canceled) {
      setImage(result.uri);
      utils.log("Image Picker Result:", result);
      // Use result.base64 for the base64 representation
    } else {
      utils.log("Image picker cancelled");
    }
  };

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={openImagePicker}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "#e0e0e0",
          }}
        />
      ) : (
        <Image
          source={require("../assets/Profile.webp")}
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: "#e0e0e0",
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "#202020",
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 3,
          borderColor: "white",
        }}
      >
        <FontAwesomeIcon icon="pencil" size={15} color="#d0d0d0" />
      </View>
    </TouchableOpacity>
  );
}

function ProfileLogout() {
  const logout = useGlobal((state) => state.logout);

  return (
    <TouchableOpacity
      onPress={logout}
      style={{
        flexDirection: "row",
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 26,
        backgroundColor: "#202020",
        marginTop: 40,
      }}
    >
      <FontAwesomeIcon
        icon="right-from-bracket"
        size={20}
        color="#d0d0d0"
        style={{ marginRight: 12 }}
      />
      <Text
        style={{
          fontWeight: "bold",
          color: "#d0d0d0",
        }}
      >
        Logout
      </Text>
    </TouchableOpacity>
  );
}

function ProfileScreen() {
  const user = useGlobal((state) => state.user);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <ProfileImage />

      <Text
        style={{
          textAlign: "center",
          color: "#303030",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 6,
        }}
      >
        {user.name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#606060",
          fontSize: 14,
        }}
      >
        @{user.username}
      </Text>

      <ProfileLogout />
    </View>
  );
}

export default ProfileScreen;
