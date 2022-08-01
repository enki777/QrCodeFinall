import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, AppState } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Homescreen from "./screens/HomeScreen";
import { Entypo, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import DonneesScreen from "./screens/DonneesScreen";
import ParametresScreen from "./screens/ParametresScreen";
import CreateCodeScreen from "./screens/CreateCodeScreen";
import ReadCodeScreen from "./screens/ReadCodeScreen";
import EachCodeScreen from "./screens/EachCodeSreen";
import AllUsersScreen from "./screens/AllUsersScreen";
import ReclamationsScreen from "./screens/UserScreens/ReclamationsScreen";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SeeUsersScreen from "./screens/AdminScreens/SeeUsersScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "white" },
  headerTitleStyle: {
    color: "black",
  },
  headerTitleAlign: "center",
  headerTintColor: "black",
};

function MyTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: "purple",
        inactiveTintColor: "black",
        tabBarStyle: {
          backgroundColor: "white",
        },
        headerTitleAlign: "center",
        // backgroundColor: "red",
      }}
    >
      <Tab.Screen
        name="Accueil"
        title="Accueil"
        component={Homescreen}
        options={{
          // headerShown: false,
          headerStyle: {
            backgroundColor: "white", //#1DA1F2
          },
          headerTitleStyle: {
            color: "black",
          },
          tabBarIcon: ({ size, color, focused, tintColor }) => (
            <Entypo
              name={"home"}
              size={size}
              color={focused ? "purple" : color}
              // color={"black"}
            />
          ),
          tabBarActiveTintColor: "purple",
          tabBarInactiveTintColor: "black",
        }}
      />
      <Tab.Screen
        name="Donnees"
        title="Codes"
        component={DonneesScreen}
        options={{
          // headerShown: false,
          headerStyle: {
            backgroundColor: "white", //#1DA1F2
          },
          headerTitleStyle: {
            color: "black",
          },
          tabBarIcon: ({ size, color, focused, tintColor }) => (
            <MaterialCommunityIcons
              name="data-matrix"
              color={focused ? "purple" : "black"}
              size={size}
            />
          ),
          tabBarActiveTintColor: "purple",
          tabBarInactiveTintColor: "black",
        }}
      />
      <Tab.Screen
        name="Parametres"
        component={ParametresScreen}
        options={{
          // headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="settings"
              color={focused ? "purple" : "black"}
              size={size}
            />
          ),
          tabBarActiveTintColor: "purple",
          tabBarInactiveTintColor: "black",
        }}
      />
    </Tab.Navigator>
  );
}

const App = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const removeAdminStatus = async () => {
    try {
      await AsyncStorage.removeItem("isAdmin");
    } catch (e) {
      // remove error
    }

    console.log("Done.");
  };

  const DisconnectHandler = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        removeAdminStatus();
        navigation.replace("Login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background /) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");

        DisconnectHandler();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen
          name="Root"
          options={{ headerShown: false }}
          component={MyTabs}
        />
        <Stack.Screen
          name="Login"
          options={{ title: "Se connecter" }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="register"
          title="S'inscrire"
          component={RegisterScreen}
        />
        <Stack.Screen name="home" title="Accueil" component={Homescreen} />
        <Stack.Screen
          name="CreateCode"
          options={{ title: "Creer un emplacement" }}
          component={CreateCodeScreen}
        />
        <Stack.Screen
          name="ReadCode"
          options={{ title: "Lire un emplacement" }}
          component={ReadCodeScreen}
        />
        <Stack.Screen
          name="EachCode"
          options={{ title: "Qr code" }}
          component={EachCodeScreen}
        />
        <Stack.Screen
          name="Allusers"
          options={{ title: "Qr code" }}
          component={AllUsersScreen}
        />
        <Stack.Screen
          name="Reclamations"
          options={{ title: "Rédigez votre réclamation" }}
          component={ReclamationsScreen}
        />
        <Stack.Screen
          name="VoirUtilisateurs"
          options={{ title: "Tous les utilisateurs" }}
          component={SeeUsersScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
