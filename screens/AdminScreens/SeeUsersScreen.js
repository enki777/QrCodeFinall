import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { getAuth } from "firebase/auth";
const SeeUsersScreen = ({ navigation }) => {
  const test = () => {
    const auth = getAuth();
    auth.getUsers().then((res) => {
      console.log(res);
    });
  };
  useEffect(() => {
    console.log("salut");
    test();
    // const unsubscribe = navigation.addListener("focus", () => {
    // });
    // return unsubscribe;
  }, [navigation]);

  return (
    <View>
      <Text>asdasdasd</Text>
    </View>
  );
};

export default SeeUsersScreen;
