import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Button,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";

const DonneesScreen = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [codes, setCodes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdminTest] = useState(false);
  const [searchText, setSearchText] = useState("");

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCodes().then((res) => {
        setCodes(res);
      });

      getData("isAdmin").then((res) => {
        console.log(res);
        setIsAdminTest(res);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async (itemKey) => {
    try {
      const jsonValue = await AsyncStorage.getItem(itemKey);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  ///////// FONCTION GETCODES
  async function getCodes() {
    const querySnapshot = await getDocs(collection(db, "QrCode"));
    const cityList = querySnapshot.docs.map((doc) => ({
      data: doc.data(),
      id: doc.id,
    }));
    return cityList;
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(1000).then(() => {
      getCodes().then((res) => {
        setCodes(res);
        setRefreshing(false);
      });
    });
  }, []);

  const HandleReclamation = () => {
    navigation.navigate("Reclamations");
  };

  const handleSearchPress = async () => {
    if (searchText == "") {
      console.log("vide");
      return Alert.alert("Veuillez saisir l'emplacement");
    }
    let test = [];
    const q = query(
      collection(db, "QrCode"),
      where("emplacement", "==", searchText)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      test.push({ id: doc.id, data: doc.data() });
    });
    console.log(test);
    setCodes(test);
  };

  const handleSearchTyping = async (data) => {
    setSearchText(data);
    if (data == "") {
      console.log("c'est vide");
      let codes = await getCodes();
      console.log(codes);
      return setCodes(codes);
    }
    console.log(data);
    let test = [];
    const q = query(collection(db, "QrCode"), where("emplacement", "==", data));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      test.push({ id: doc.id, data: doc.data() });
    });
    console.log(test);
    setCodes(test);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          margin: 10,
          backgroundColor: "white",
          padding: 10,
          borderRadius: 220,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="votre recherche par emplacement Ex: Eee"
          onChangeText={(e) => handleSearchTyping(e)}
          clearButtonMode="always"
        />
        <TouchableOpacity onPress={handleSearchPress}>
          <Entypo
            name="magnifying-glass"
            size={40}
            color="purple"

            // style={{ padding: 10, backgroundColor: "white" }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ marginLeft: 20, marginBottom: 20 }}>
        <Text>*Swiper vers le bas pour réinitialiser la recherche.</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {codes
          ? Object.keys(codes).map((key, index) => {
              // console.log(codes[key]["data"]);
              return (
                <View key={index} style={styles.eachCard}>
                  <Text>Qrcode_id : {codes[key]["id"]}</Text>
                  {Object.keys(codes[key]["data"]).map((key2, index2) => {
                    // return (
                    //   <View key={index2} style={styles.eachCardRow}></View>
                    // );
                  })}
                  <View style={styles.actionsContainer}>
                    <Button
                      title="Voir Qr Code"
                      onPress={() => {
                        navigation.navigate("EachCode", {
                          qrCode: codes[key]["id"],
                        });
                      }}
                    />
                    {isAdmin == true ? (
                      <View>
                        <View style={{ marginTop: 5 }}>
                          <Button
                            title="Modifier le Qr Code"
                            color="purple"
                            onPress={() => {
                              navigation.navigate("ModifierQrCodes", {
                                qrCode: codes[key]["id"],
                              });
                            }}
                          />
                        </View>
                        <View style={{ marginTop: 5 }}>
                          <Button
                            title="Voir Reclamations"
                            color="purple"
                            onPress={() => {
                              navigation.navigate("Reclamations", {
                                qrCode: codes[key]["id"],
                              });
                            }}
                          />
                        </View>
                      </View>
                    ) : (
                      <Button
                        title="Effectuer une réclamation"
                        color="purple"
                        onPress={() => {
                          navigation.navigate("Reclamations", {
                            qrCode: codes[key]["id"],
                          });
                        }}
                      />
                    )}
                  </View>
                </View>
              );
            })
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
  },
  addButton: {
    margin: 30,
  },
  readButton: {
    margin: 30,
  },
  halfTop: {
    backgroundColor: "white",
    height: "50%",
    alignItems: "center",
  },
  title: {
    color: "orange",
    paddingTop: "10%",
  },
  eachCard: {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    borderRadius: 5,
  },
  eachCardRow: {
    display: "flex",
    flexDirection: "row",
  },
  leftText: {
    width: "40%",
  },
  rightText: {
    color: "purple",
  },
  actionsContainer: {
    marginTop: 10,
  },
});

export default DonneesScreen;
