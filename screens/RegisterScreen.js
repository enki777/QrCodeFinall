import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Animated,
} from "react-native";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Retour",
      headerTitle: "S'inscrire",
    });
  }, [navigation]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const register = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, mdp)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        const auth = getAuth();

        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL:
            photoUrl ||
            "https://www.freepnglogos.com/uploads/among-us-png/among-us-purple-character-png-1.png",
        });
        // .then(() => {
        //   navigation.replace("Root");
        // })
        // .catch((error) => {
        //   // An error occurred
        //   // ...
        // });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ..
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Votre Pseudo"
          placeholderTextColor="lightgrey"
        />

        <TextInput
          autoCapitalize="none"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Votre Email"
          placeholderTextColor="lightgrey"
        />

        <TextInput
          autoCapitalize="none"
          placeholder="Votre image (optionnel)"
          style={styles.input}
          value={photoUrl}
          onChangeText={(text) => setPhotoUrl(text)}
          placeholderTextColor="lightgrey"
        />

        <TextInput
          autoCapitalize="none"
          placeholder="Votre mot de passe"
          type="password"
          secureTextEntry
          style={styles.input}
          value={mdp}
          onChangeText={(text) => setMdp(text)}
          onSubmitEditing={register}
          placeholderTextColor="lightgrey"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          raised
          style={styles.button}
          title="S'inscrire"
          onPress={register}
          color="#6825B6"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(29, 46, 54, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    // backgroundColor: "red",
    width: 300,
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderColor: "orange",
    color: "white",
    // padding: 10,
  },
  buttonContainer: {
    width: 200,
    margin: 10,
  },
});

export default RegisterScreen;
