import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text } from "react-native";
import { db } from "../../firebase";
import { getAuth, getUsers } from "firebase/auth";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
const SeeUsersScreen = ({ navigation }) => {
  useEffect(() => {
    const UserRole = collection(db, "Authentication");
    console.log(UserRole);
  }, [navigation]);

  return (
    <View>
      <Text>asdasdasd</Text>
    </View>
  );
};

export default SeeUsersScreen;
