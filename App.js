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
import ParametresScreen from "./screens/Parametres/ParametresScreen";
import CreateCodeScreen from "./screens/AdminScreens/CreateCodeScreen";
import ReadCodeScreen from "./screens/ReadCodeScreen";
import EachCodeScreen from "./screens/EachCodeSreen";
import AllUsersScreen from "./screens/AllUsersScreen";
import ReclamationsScreen from "./screens/reclamations/ReclamationsScreen";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SeeUsersScreen from "./screens/AdminScreens/SeeUsersScreen";
import UpdateQrScreen from "./screens/AdminScreens/UpdateQrScreen";
import MyInfoScreen from "./screens/Parametres/MyInfoScreen";
import ChaqueReclamScreen from "./screens/UserScreens/ChaqueReclamScreen";
import CreateReclamationScreen from "./screens/reclamations/CreateReclamationScreen";
import AdminSeeReclamationScreen from "./screens/AdminScreens/SeeReclamationScreen";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Button } from "react-native";
import { auth } from "./firebase";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: "orange",
        headerStyle: {
          backgroundColor: "rgba(20, 32, 37, 1)",
        },
        // activeTintColor: "purple",
        // inactiveTintColor: "red",
        tabBarStyle: {
          backgroundColor: "rgba(20, 32, 37, 1)",
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        // title="Accueil"
        component={Homescreen}
        options={{
          headerTitleStyle: {
            color: "orange",
          },
          tabBarIcon: ({ size, color, focused, tintColor }) => (
            <Entypo
              name={"home"}
              size={size}
              color={focused ? "#6825B6" : "orange"}
              // color={"black"}
            />
          ),
          tabBarActiveTintColor: "#6825B6",
          tabBarInactiveTintColor: "white",
          // headerRight: () => (
          //   <View
          //     style={{
          //       backgroundColor: "rgba(29, 46, 54, 1)",
          //       marginRight: 20,
          //       fontSize: 10,
          //       borderRadius: 20,
          //       paddingHorizontal: 20,
          //       paddingVertical: 7,
          //     }}
          //   >
          //     <Text style={{ color: "orange" }}>
          //       {auth.currentUser.displayName}
          //     </Text>
          //   </View>
          // ),
        }}
      />
      <Tab.Screen
        name="Donnees"
        title="Codes"
        component={DonneesScreen}
        options={{
          // headerShown: false,
          // headerStyle: {
          //   backgroundColor: "white", //#1DA1F2
          // },
          headerBackTitle: "salasd",
          headerTitleStyle: {
            color: "orange",
          },
          tabBarIcon: ({ size, color, focused, tintColor }) => (
            <MaterialCommunityIcons
              name="data-matrix"
              color={focused ? "#6825B6" : "orange"}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#6825B6",
          tabBarInactiveTintColor: "white",
        }}
      />
      <Tab.Screen
        name="Parametres"
        component={ParametresScreen}
        options={{
          headerTitleStyle: {
            color: "orange",
          },
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="settings"
              color={focused ? "#6825B6" : "orange"}
              size={size}
            />
          ),
          tabBarActiveTintColor: "#6825B6",
          tabBarInactiveTintColor: "white",
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
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState ", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          // headerBackVisible: false,
          headerBackTitleVisible: false,
          headerTintColor: "orange",
          headerStyle: {
            backgroundColor: "rgba(20, 32, 37, 1)",
          },
        }}
      >
        <Stack.Screen
          name="Root"
          options={{ headerShown: false }}
          component={MyTabs}
        />
        <Stack.Screen
          name="Login"
          options={{ title: "Se connecter", headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="register"
          title="S'inscrire"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="home"
          component={Homescreen}
          options={{ headerShown: false }}
        />
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
          options={{ title: "Ecran des réclamations" }}
          component={ReclamationsScreen}
        />
        <Stack.Screen
          name="VoirUtilisateurs"
          options={{ title: "Tous les utilisateurs" }}
          component={SeeUsersScreen}
        />
        <Stack.Screen
          name="ModifierQrCodes"
          options={{ title: "Update Qr Code" }}
          component={UpdateQrScreen}
        />
        <Stack.Screen
          name="MesInfos"
          options={{ title: "Informations personnelles" }}
          component={MyInfoScreen}
        />
        <Stack.Screen
          name="ChaqueReclam"
          options={{ title: "Infos Réclamation" }}
          component={ChaqueReclamScreen}
        />
        <Stack.Screen
          name="CreerReclam"
          options={{ title: "Creez une Réclamation" }}
          component={CreateReclamationScreen}
        />
        <Stack.Screen
          name="AdminVoirReclam"
          options={{ title: "Toutes les réclamations" }}
          component={AdminSeeReclamationScreen}
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
