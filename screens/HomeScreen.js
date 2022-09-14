import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { auth } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { Avatar } from "@rneui/themed";

const Homescreen = ({ route, navigation }) => {
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    setUserName(auth.currentUser.displayName);
    navigation.setOptions({
      // headerTitle: "WoodLand",
      headerLeft: () => (
        <View
          style={{
            marginLeft: 20,
            // backgroundColor: "red",
            // width: "30%",
            // padding: 5,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("MesInfos")}
          >
            <Avatar
              rounded
              source={{ uri: auth?.currentUser?.photoURL }}
              avatarStyle={{ borderColor: "white", borderWidth: 1 }}
            />
            <View
              style={{
                // marginLeft: 5,
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 3,
              }}
            >
              <Text
                style={{
                  color: "orange",
                  fontSize: 20,
                }}
              >
                {auth?.currentUser?.displayName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    getData("isAdmin").then((res) => {
      // console.log(res);
      setIsAdmin(res);
    });
  }, [navigation]);

  const getData = async (itemKey) => {
    try {
      const jsonValue = await AsyncStorage.getItem(itemKey);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const addButtonHandler = () => {
    navigation.navigate("CreateCode");
  };

  const readButtonHandler = () => {
    navigation.navigate("ReadCode");
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {isAdmin == true && (
          // <View style={styles.buttons}>
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.43)",
              borderRadius: 5,
              padding: 20,
              justifyContent: "center",
              margin: 10,
            }}
          >
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={addButtonHandler}
            >
              <AntDesign name="pluscircle" size={80} color="#6825B6" />
              <View
                style={{
                  borderRadius: 30,
                  // backgroundColor: "purple",
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 17,
                  }}
                >
                  Ajouter un emplacement
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          // </View>
        )}
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.43)",
            borderRadius: 5,
            padding: 20,
            justifyContent: "center",
            margin: 10,
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={readButtonHandler}
          >
            <Entypo name="camera" size={80} color="#6825B6" style={{}} />
            <View
              style={{
                borderRadius: 30,
                // backgroundColor: "purple",
                paddingLeft: 15,
                paddingRight: 15,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 17,
                }}
              >
                Lire un emplacement
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar hidden={false} style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(29, 46, 54, 1)",
    justifyContent: "center",
  },
  addButton: {
    margin: 30,
  },
  readButton: {
    margin: 30,
  },
  halfTop: {
    backgroundColor: "white",
    height: "50%",
    alignItems: "center",
  },
  title: {
    color: "purple",

    fontSize: 30,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  halfBottom: {},
  buttonsContainer: {
    // backgroundColor: "red",
    // flex: 1,
    width: "80%",
    // padding: 10,
    // justifyContent: "center",
    marginTop: 0,
    // backgroundColor: "blue",
  },
  buttons: {},
});

export default Homescreen;
