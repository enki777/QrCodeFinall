import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { auth } from "../../firebase";

const MyInfoScreen = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser({
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
      emailVerified: auth.currentUser.emailVerified,
      uid: auth.currentUser.uid,
    });
  }, []);

  const handleUpdatePseudo = async () => {
    Alert.alert("Validation", "Acceptez-vous la modification du QR Code ? ", [
      {
        text: "Annuler",
        onPress: () => console.log("Annuler appuyé"),
      },
      {
        text: "Valider",
        onPress: () => updateQr(),
      },
    ]);
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
          <Button title="Ajouter une photo" />
        </View>

        <View style={{ width: "90%", margin: 5 }}>
          <Button title="Modifier mon pseudo" onPress={handleUpdatePseudo} />
        </View>
      </View>
    </View>
  );
};

export default MyInfoScreen;
