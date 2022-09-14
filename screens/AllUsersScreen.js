import React, { useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { db, getDocs, collection } from "../firebase";

const AllUsersScreen = ({ navigation }) => {
  const [utilisateurs, setUtilisateurs] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Tous les utilisateurs",
    });

    const test = getDocs(collection(db, "utilisateurs"));
    test.then((res) =>
      res.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data()}`);
        // console.log(doc.data());
        setUtilisateurs({});
      })
    );
  }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>text</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllUsersScreen;
