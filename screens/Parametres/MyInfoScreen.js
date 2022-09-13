import { useLayoutEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
// import { auth } from "../../firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const MyInfoScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const auth = getAuth();
      setUser({
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        emailVerified: auth.currentUser.emailVerified,
        uid: auth.currentUser.uid,
      });
    });

    return unsubscribe;
  }, [navigation]);

  const handleUpdatePseudo = async () => {
    Alert.prompt(
      "Mise à jour de votre pseudo",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
          // onPress: () => ,
        },
        {
          text: "Valider",
          onPress: (e) => updatePseudo(e),
        },
      ],
      "plain-text",
      user.displayName
    );
  };

  const updatePseudo = async (string) => {
    // console.log(string);
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: string,
      //   photoURL:
      //     photoUrl ||
      //     "https://www.freepnglogos.com/uploads/among-us-png/among-us-purple-character-png-1.png",
    }).then((res) => {
      Alert.alert(`Votre pseudo : ${string} \n a bien été sauvegardé.`);
      navigation.replace("MesInfos");
    });
  };

  const promptPhotoUrlForm = async () => {
    Alert.prompt(
      "Mise à jour de votre image",
      "",
      [
        {
          text: "Annuler",
          style: "cancel",
          // onPress: () => ,
        },
        {
          text: "Valider",
          onPress: (e) => handleUpdatePhotoUrl(e),
        },
      ],
      "plain-text"
      // user.photoURL
    );
  };

  const handleUpdatePhotoUrl = async (string) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      photoURL: string,
    }).then((res) => {
      Alert.alert(`Votre image : ${string} \n a bien été sauvegardée.`);
      navigation.replace("MesInfos");
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "rgba(29, 46, 54, 1)",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 5,
          height: "30%",
          width: "80%",
          marginTop: 50,
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 20, marginBottom: 20 }}>Mes informations</Text>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row" }}>
            <Text>ID : </Text>
            <Text style={{ color: "grey" }}>{user.uid}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>displayName : </Text>
            <Text style={{ color: "grey" }}>{user.displayName}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>email : </Text>
            <Text style={{ color: "grey" }}>{user.email}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>photoURL : </Text>
            <Text style={{ color: "grey" }}>{user.photoURL}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text>emailVerified : </Text>
            <Text style={{ color: "grey" }}>{user.emailVerified}</Text>
          </View>
        </View>
      </View>
      {/* boutons de modif */}
      <View
        style={{
          marginTop: 30,
          padding: 20,
          // backgroundColor: "lightblue",
          width: "80%",
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* <View style={{ width: "90%", margin: 5 }}>
          <Button title="modifier mon mot de passe" />
        </View> */}

        <View style={{ width: "90%", margin: 5 }}>
          <Button
            title="Ajouter une photo"
            color="#6825B6"
            onPress={promptPhotoUrlForm}
          />
        </View>

        <View style={{ width: "90%", margin: 5 }}>
          <Button
            title="Modifier mon pseudo"
            onPress={handleUpdatePseudo}
            color="#6825B6"
          />
        </View>
      </View>
    </View>
  );
};

export default MyInfoScreen;
