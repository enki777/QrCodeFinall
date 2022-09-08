import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { db, collection, doc, setDoc, addDoc } from "../../firebase";

const CreateCodeScreen = ({ navigation, route }) => {
  useEffect(() => {
    navigation.setOptions({
      // headerStyle: { backgroundColor: "lightgrey" },
    });

    return () => {};
  }, [navigation]);

  const [codeEcran, setCodeEcran] = useState("");
  const [codeEcran2, setCodeEcran2] = useState("");
  const [emplacement, setEmplacement] = useState("");
  // const [formData, setFormData] = useState(null);

  const CreatePosteAttempt = async () => {
    try {
      const docRef = await addDoc(collection(db, "QrCode"), {
        emplacement: emplacement,
        codeEcran: codeEcran,
        codeEcran2: codeEcran2,
      });

      alert(`Document written with ID: ${docRef.id}`);
      navigation.replace("Root");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={emplacement}
        onChangeText={(e) => setEmplacement(e)}
        placeholder="Saisissez l'emplacement"
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        onChangeText={(e) => setCodeEcran(e)}
        value={codeEcran}
        placeholder="Saisissez le code écran 1"
        placeholderTextColor="black"
      />

      <TextInput
        style={styles.input}
        value={codeEcran2}
        onChangeText={(e) => setCodeEcran2(e)}
        placeholder="Saisissez le code écran 2"
        placeholderTextColor="black"
      />

      <View style={styles.submitButton}>
        <Button
          title="Générer le QR code"
          onPress={CreatePosteAttempt}
          color="purple"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightgrey",
  },
  input: {
    width: 300,
    borderBottomColor: "purple",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  submitButton: {
    width: 200,
    marginVertical: 30,
  },
  errorMessage: {
    color: "red",
  },
  QRCode: {
    backgroundColor: "white",
    padding: 10,
  },
});

export default CreateCodeScreen;
