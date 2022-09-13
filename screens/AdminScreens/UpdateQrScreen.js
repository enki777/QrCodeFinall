import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { collection, doc, db, getDoc, updateDoc } from "../../firebase";
import Ionicons from "@expo/vector-icons/Ionicons";

const UpdateQrScreen = ({ navigation, route }) => {
  const [qrId, setQrId] = useState();
  const [qrData, setQrData] = useState({});
  const [emplacement, setEmplacement] = useState("");
  const [codeEcran, setCodeEcran] = useState("");
  const [codeEcran2, setCodeEcran2] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrId(route.params.qrCode);
      getQrDoc(route.params.qrCode).then((res) => {
        console.log(res);
        setQrData(res);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const getQrDoc = async (id) => {
    const docRef = doc(db, "QrCode", id);
    const snap = await getDoc(docRef);
    return snap.data();
  };

  const getGoodEmplacement = async (emplacement) => {
    if (emplacement == "") {
      return qrData.emplacement;
    } else {
      return emplacement;
    }
  };

  const getGoodCodeEcran = async (codeEcran) => {
    if (codeEcran == "") {
      return qrData.codeEcran;
    } else {
      return codeEcran;
    }
  };

  const getGoodCodeEcran2 = async (codeEcran2) => {
    if (codeEcran2 == "") {
      return qrData.codeEcran2;
    } else {
      return codeEcran2;
    }
  };

  const updateQr = async () => {
    const goodEmplacement = await getGoodEmplacement(emplacement);
    const goodCodeEcan = await getGoodCodeEcran(codeEcran);
    const goodCodeEcan2 = await getGoodCodeEcran2(codeEcran2);

    console.log(goodEmplacement);
    console.log(goodCodeEcan);
    console.log(goodCodeEcan2);

    const docRef = doc(db, "QrCode", qrId);
    updateDoc(docRef, {
      emplacement: goodEmplacement,
      codeEcran: goodCodeEcan,
      codeEcran2: goodCodeEcan2,
    }).then((res) => {
      Alert.alert("Le Document a bien été mis à jour.");
    });
  };

  const ValidateUpdate = () => {
    if (emplacement == "" && codeEcran == "" && codeEcran2 == "") {
      Alert.alert("Veillez à apporter une modification au formulaire.");
    } else {
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
    }
  };

  return (
    // <SafeAreaView>
    <ScrollView
      style={{
        padding: 30,
        flex: 1,
        backgroundColor: "rgba(29, 46, 54, 1)",
        // alignItems: "center",
      }}
    >
      <View
        style={{
          borderWidth: 2,
          borderColor: "orange",
          borderRadius: 4,
          padding: 12,
        }}
      >
        <Text style={{ color: "white" }}>Informations du poste : {qrId}</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
          }}
        >
          <Text style={{ width: "50%", color: "white" }}>emplacement : </Text>
          <TextInput
            style={{ width: "50%", color: "white" }}
            onChangeText={(e) => setEmplacement(e)}
            placeholder={qrData.emplacement}
            placeholderTextColor="rgba(110, 60, 7, 1)"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
          }}
        >
          <Text style={{ width: "50%", color: "white" }}>codeEcran : </Text>
          <TextInput
            style={{ width: "50%", color: "white" }}
            onChangeText={(e) => setCodeEcran(e)}
            placeholder={qrData.codeEcran}
            placeholderTextColor="rgba(110, 60, 7, 1)"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 10,
          }}
        >
          <Text style={{ width: "50%", color: "white" }}>codeEcran2 : </Text>
          <TextInput
            style={{ width: "50%", color: "white" }}
            onChangeText={(e) => setCodeEcran2(e)}
            placeholder={qrData.codeEcran2}
            placeholderTextColor="rgba(110, 60, 7, 1)"
          />
        </View>
      </View>
      <Text style={{ color: "lightgrey", marginTop: 5 }}>
        * Effacez un champ pour retrouver sa valeur avant modification.
      </Text>

      <View style={{ marginTop: 30 }}>
        <Button
          title="Appliquer les modifications"
          onPress={ValidateUpdate}
          color="#6825B6"
        />
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
};

export default UpdateQrScreen;
