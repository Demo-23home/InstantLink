import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React, { useState } from "react";
import { SafeAreaView, TextInput, View } from "react-native";
import Empty from "../common/Empty";

const SearchScreen = () => {
  const [query, setQuery] = useState("");
  const searchList = null;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          padding: 16,
          borderWidth: 1,
          borderColor: "#f0f0f0",
        }}
      >
        <View>
          <TextInput
            style={{
              backgroundColor: "#e1e2e4",
              height: 52,
              borderRadius: 26,
              padding: 16,
              fontSize: 16,
              paddingLeft: 50,
            }}
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor={"#b0b0b0"}
          />
          <FontAwesomeIcon
            icon="magnifying-glass"
            size={20}
            color="#505050"
            style={{
              position: "absolute",
              left: 18,
              top: 17,
            }}
          />
        </View>
      </View>
      {searchList === null ? (
        <Empty
          icon="magnifying-glass"
          message={"Search for friends "}
          centered={false}
        />
      ) : searchList.length === 0 ? (
        <Empty
          icon="triangle-exclamation"
          message={'No users found for "' + query + '"'}
          centered={false}
        />
      ) : (
        <View />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
