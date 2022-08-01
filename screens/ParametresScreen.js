import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ParametresScreen = ({ navigation }) => {
  const [isAdmin, setIsAdminTest] = useState(false);

  useEffect(() => {
    getIsAdminStatus().then((res) => {
      console.log(res);
      if (res == null) {
        setIsAdminTest(false);
        console.log(isAdmin);
      } else if (res.isAdmin != true) {
        setIsAdminTest(false);
      } else if (res.isAdmin == true) {
        setIsAdminTest(true);
      }
    });
  }, [navigation]);

  function adminPannel() {
    return (
      <View>
        <View style={{ margin: 20 }}>
          <Button
            title="Créer un nouvel utilisateur"
            color="purple"
            onPress={CreateuserHandlder}
          />
        </View>
        <View style={{ margin: 20 }}>
          <Button
            title="Voir utilisateurs"
            color="purple"
            onPress={SeeUsersHandler}
          />
        </View>
      </View>
    );
  }

  const removeAdminStatus = async () => {
    try {
      await AsyncStorage.removeItem("isAdmin");
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
    navigation.navigate("CreateAccount");
  };

  const SeeUsersHandler = () => {
    navigation.navigate("VoirUtilisateurs");
  };
  return (
    <View style={{ backgroundColor: "rgba(56, 0, 72, 1)", flex: 1 }}>
      <View style={{ margin: 20, backgroundColor: "white", borderRadius: 5 }}>
        {isAdmin ? (
          <Text style={{ color: "purple", fontSize: 20, margin: 20 }}>
            Espace Administrateur
          </Text>
        ) : (
          <View>
            <View>
              <Text style={{ color: "purple", fontSize: 20, margin: 20 }}>
                Espace utilisateur
              </Text>
            </View>
            <Button
              title="Mes informations"
              color=""
              onPress={DisconnectHandler}
            />
          </View>
        )}

        {isAdmin ? adminPannel() : null}
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
