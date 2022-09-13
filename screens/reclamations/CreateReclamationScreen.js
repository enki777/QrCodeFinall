import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";

const CreateReclamationScreen = ({ navigation }) => {
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
        placeholderTextColor="lightgrey"
      />

      <TextInput
        style={styles.input}
        onChangeText={(e) => setCodeEcran(e)}
        value={codeEcran}
        placeholder="Saisissez le code écran 1"
        placeholderTextColor="lightgrey"
      />

      <TextInput
        style={styles.input}
        value={codeEcran2}
        onChangeText={(e) => setCodeEcran2(e)}
        placeholder="Saisissez le code écran 2"
        placeholderTextColor="lightgrey"
      />

      <View style={styles.submitButton}>
        <Button
          title="Envoyer la Réclamation"
          onPress={CreatePosteAttempt}
          color="#6825B6"
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
    backgroundColor: "rgba(29, 46, 54, 1)",
  },
  input: {
    height: 40,
    width: 300,
    borderBottomColor: "orange",
    borderBottomWidth: 1,
    marginVertical: 20,
    color: "white",
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

export default CreateReclamationScreen;
