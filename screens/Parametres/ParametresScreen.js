import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParametresScreen = ({ navigation }) => {
  const [isAdmin, setIsAdminHook] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getIsAdminStatus().then((res) => {
        console.log(res);
        setIsAdminHook(res);
      });
    });

    return unsubscribe;
  }, [navigation]);

  function adminPannel() {
    return (
      <View>
        <View style={{ margin: 20 }}>
          <Button
            title="Créer un nouvel utilisateur"
            color="#6825B6"
            onPress={CreateuserHandlder}
          />
        </View>
        <View style={{ margin: 20 }}>
          <Button
            title="Voir utilisateurs"
            color="#6825B6"
            onPress={SeeUsersHandler}
          />
        </View>
        <View style={{ margin: 20 }}>
          <Button
            title="Mes informations"
            color="#6825B6"
            onPress={() => navigation.navigate("MesInfos")}
          />
        </View>
      </View>
    );
  }

  const removeAdminStatus = async () => {
    try {
      await AsyncStorage.removeItem("isAdmin");
      console.log("adminStorage detruit");
    } catch (e) {
      // remove error
    }

    console.log("Done.");
  };

  const getIsAdminStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("isAdmin");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
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

  const CreateuserHandlder = () => {
    Alert.alert("Fonctionnalité momentanément non disponible.");
  };

  const SeeUsersHandler = () => {
    Alert.alert("Fonctionnalité momentanément non disponible.");
  };
  return (
    <View style={{ backgroundColor: "rgba(29, 46, 54, 1)", flex: 1 }}>
      <View
        style={{
          margin: 20,
          backgroundColor: "rgba(255, 255, 255, 1)",
          borderRadius: 20,
        }}
      >
        {isAdmin == true ? (
          <View
            style={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              backgroundColor: "rgba(42, 67, 79, 1)",
            }}
          >
            <Text
              style={{
                color: "orange",
                fontSize: 20,
              }}
            >
              Espace Administrateur
            </Text>
          </View>
        ) : (
          <View>
            <View>
              <Text style={{ color: "#6825B6", fontSize: 20, margin: 20 }}>
                Espace utilisateur
              </Text>
            </View>
            <Button
              title="Mes informations"
              color=""
              onPress={() => {
                navigation.navigate("MesInfos");
              }}
            />
          </View>
        )}

        {isAdmin == true ? adminPannel() : null}
      </View>
      <View
        style={{
          flex: 1,
          margin: 20,
          justifyContent: "flex-end",
        }}
      >
        <Button title="Se déconnecter" color="" onPress={DisconnectHandler} />
      </View>
    </View>
  );
};

export default ParametresScreen;
