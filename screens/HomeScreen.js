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
      >
        <Animated.Text
          style={{
            opacity: fadeAnim,
            backgroundColor: "white",
            padding: 20,
            borderRadius: 5,
            fontSize: 25,
            color: "purple",
          }}
        >
          Bonjour {userName}
        </Animated.Text>
      </View>
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
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={readButtonHandler}
        >
          <Entypo name="camera" size={100} color="purple" />
          <Text
            style={{
              color: "white",
              fontSize: 17,
              backgroundColor: "purple",
              padding: 10,
              borderRadius: 30,
            }}
          >
            Lire un emplacement
          </Text>
          {/* <Button
            onPress={readButtonHandler}
            title="Afficher le detail d'un emplacement"
            color="#841584"
            // accessibilityLabel="Learn more about this purple button"
          /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightgrey",
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
    width: "100%",
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
