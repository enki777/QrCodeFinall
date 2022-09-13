import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Root");
      }
    });

    return unsubscribe;
  }, []);

  const storeAdminStatus = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("isAdmin", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const signIn = async () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.trim(), mdp)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const UserRole = collection(db, "UserRole");

        const q = query(UserRole, where("userId", "==", `${user.uid}`));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          storeAdminStatus(doc.data().isAdmin);
        });
        navigation.replace("Root");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage != null) {
          alert(errorMessage);
        }
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Votre email"
          autoCapitalize="none"
          placeholderTextColor="lightgrey"
        />

        <TextInput
          placeholder="Votre mot de passe"
          style={styles.input}
          value={mdp}
          onChangeText={(text) => setMdp(text)}
          secureTextEntry
          type="password"
          onSubmitEditing={signIn}
          autoCapitalize="none"
          placeholderTextColor="lightgrey"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button}
          title="Se connecter"
          onPress={signIn}
          color="orange"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          style={styles.button2}
          color="#6825B6"
          title="S'inscrire"
          onPress={() => navigation.navigate("register")}
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
    color: "black",
    width: 300,
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    borderColor: "orange",
    // padding: 10,
    color: "white",
  },
  buttonContainer: {
    width: 200,
    margin: 10,
  },
});

export default LoginScreen;
