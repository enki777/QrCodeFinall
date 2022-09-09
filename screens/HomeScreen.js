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
import { Entypo } from "@expo/vector-icons";

const Homescreen = ({ route, navigation }) => {
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setUserName(auth.currentUser.displayName);
    // navigation.setOptions({
    //   // headerTitle: "Accueil",
    // });
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    getData("isAdmin").then((res) => {
      console.log(res);
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
      <View
        style={{
          height: "30%",
          // backgroundColor: "red",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></View>
      <View style={styles.buttonsContainer}>
        {isAdmin == true && (
          <View style={styles.buttons}>
            <Button
              onPress={addButtonHandler}
              title="Creer un nouvel emplacement"
              color="#841584"
              // accessibilityLabel="Learn more about this purple button"
            />
          </View>
        )}
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.43)",
            borderRadius: 5,
            padding: 20,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={readButtonHandler}
          >
            <Entypo name="camera" size={100} color="orange" style={{}} />
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
    flex: 1,
    // width: "100%",
    justifyContent: "flex-start",
    marginTop: 0,
    // backgroundColor: "blue",
  },
  buttons: {
    // flex: 1,
    marginTop: 20,
    marginLeft: "15%",
    marginRight: "15%",
  },
});

export default Homescreen;
