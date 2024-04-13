import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { launchImageLibraryAsync } from "expo-image-picker"; // Import from expo-image-picker
import useGlobal from "../core/global";
import utils from "../core/utils";
// import Thumbnail from "../common/Thumbnail";

function ProfileImage() {
  const uploadThumbnail = useGlobal((state) => state.uploadThumbnail);
  const user = useGlobal((state) => state.user);

  const pickImage = async () => {
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        const file = {
          name: `thumbnail_${Date.now()}.jpg`,
          base64: result.assets[0].base64,         
          // uri: result.uri,
          // type: result.type,
        };
        uploadThumbnail(file);
        // utils.log(result.assets[0]);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={pickImage}>
      {/* <Thumbnail url={user.thumbnail} size={180} /> */}
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
