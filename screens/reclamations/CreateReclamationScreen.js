import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { collection, doc, setDoc, addDoc } from "../../firebase";

const CreateReclamationScreen = ({ navigation, route }) => {
  const [motif, setMotif] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [qrId, setQrId] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrId(route.params.qrId);
    });
    return unsubscribe;
  }, [navigation]);

  const CreateReclamationAttempt = async () => {
    const auth = getAuth();

    if (motif != "" || commentaire != "") {
      try {
        const docRef = await addDoc(collection(db, "Reclamation"), {
          motif: motif,
          commentaire: commentaire,
          qrId: qrId,
          userId: auth.currentUser.uid,
          isDone: false,
        });

        Alert.alert("Votre réclamation a bien été prise ne compte.");
        navigation.replace("Reclamations", {
          qrId: qrId,
        });
      } catch (e) {
        Alert.alert(e);
      }
    } else {
      Alert.alert("Veuillez remplir au moins un champs.");
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={motif}
        onChangeText={(e) => setMotif(e)}
        placeholder="Motif (obligatoire)"
        placeholderTextColor="lightgrey"
      />

      <TextInput
        style={styles.input}
        onChangeText={(e) => setCommentaire(e)}
        value={commentaire}
        placeholder="Commentaire"
        placeholderTextColor="lightgrey"
        multiline={true}
      />

      <View style={styles.submitButton}>
        <Button
          title="Soumettre la Réclamation"
          onPress={CreateReclamationAttempt}
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
