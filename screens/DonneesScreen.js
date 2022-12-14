import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
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
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const DonneesScreen = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [codes, setCodes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdminTest] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [onlyPrinted, setOnlyPrinted] = useState(false);
  const svg = useRef();

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCodes().then((res) => {
        setCodes(res);
      });

      getData("isAdmin").then((res) => {
        // console.log(res);
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

  const handleSearchPress = async () => {
    if (searchText == "") {
      // console.log("vide");
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
    // console.log(test);
    setCodes(test);
  };

  const handleSearchTyping = async (data) => {
    setSearchText(data);
    if (data == "") {
      // console.log("c'est vide");
      let codes = await getCodes();
      // console.log(codes);
      return setCodes(codes);
    }
    // console.log(data);
    let test = [];
    const q = query(collection(db, "QrCode"), where("emplacement", "==", data));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      test.push({ id: doc.id, data: doc.data() });
    });
    // console.log(test);
    setCodes(test);
  };

  const DisplayQrCode = ({ formData }) => {
    return (
      <QRCode
        value={JSON.stringify(formData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
        color="rgba(20, 32, 37, 1)"
      />
    );
  };

  const handleOnlyPrintedQr = async () => {
    if (onlyPrinted) {
      getPrintedOrNotQr(!onlyPrinted);
      setOnlyPrinted(false);
    } else {
      getPrintedOrNotQr(!onlyPrinted);
      setOnlyPrinted(true);
    }
  };

  const getPrintedOrNotQr = async (isPrinted) => {
    let test = [];
    const q = query(
      collection(db, "QrCode"),
      where("isPrinted", "==", isPrinted)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      test.push({ id: doc.id, data: doc.data() });
    });
    // console.log(test);
    setCodes(test);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "rgba(29, 46, 54, 1)",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          // width: "100%",
          backgroundColor: "white",
          borderRadius: 20,
          paddingLeft: 20,
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 5 }}>
          <TextInput
            placeholder="Ex: Eee"
            onChangeText={(e) => handleSearchTyping(e)}
            clearButtonMode="always"
          />
        </View>

        {onlyPrinted == true ? (
          <View
            style={{
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              alignContent: "center",
              backgroundColor: "orange",
              paddingHorizontal: 20,
              paddingTop: 4,
              height: "115%",
              alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handleOnlyPrintedQr}>
              <Feather name="printer" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
              alignContent: "center",
              backgroundColor: "orange",
              paddingHorizontal: 20,
              paddingTop: 4,
              height: "100%",
              alignItems: "center",
              // justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={handleOnlyPrintedQr}>
              <Feather name="printer" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            backgroundColor: "#6825B6",
            flex: 1,
            alignItems: "center",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            padding: 5,
          }}
        >
          <TouchableOpacity onPress={handleSearchPress}>
            <Entypo
              name="magnifying-glass"
              size={30}
              color="white"
              // style={{ padding: 10, backgroundColor: "white" }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginLeft: 20, marginBottom: 20 }}>
        <Text style={{ color: "white" }}>
          *Rechercher uniquement les QRcodes deja imprim??s ?? l'aide du bouton
          d'impression.
        </Text>
        <Text style={{ color: "white" }}>
          *D??sactiver le bouton d'impression lancera une recherche ne concernant
          que les QRCodes non imprim??s.
        </Text>
        <Text style={{ color: "white" }}>
          *Swiper vers le bas pour r??initialiser la recherche.
        </Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {codes
          ? Object.keys(codes).map((key, index) => {
              return (
                <View key={index} style={styles.eachCard}>
                  {/* <View
                    style={{
                      padding: 10,
                      backgroundColor: "rgba(25, 42, 50, 1)",
                      borderRadius: 5,
                    }}
                  >
                    <DisplayQrCode formData={codes[key]} />
                  </View> */}
                  {/* {
                    <QRCode
                      value={JSON.stringify(codes[key])}
                      size={300}
                      getRef={(ref) => (svg.current = ref)}
                    />
                  } */}
                  {/* <DisplayQrCode formData={codes[key]["id"]} /> */}
                  <Text style={{ marginTop: 5, color: "white" }}>
                    Qrcode_id : {codes[key]["id"]}
                  </Text>

                  <View style={styles.actionsContainer}>
                    <View
                      style={{
                        borderRadius: 20,
                        backgroundColor: "white",
                      }}
                    >
                      <Button
                        title="Voir Qr Code"
                        color="orange"
                        onPress={() => {
                          navigation.navigate("EachCode", {
                            qrId: codes[key]["id"],
                          });
                        }}
                      />
                    </View>
                    {isAdmin == true ? (
                      <View>
                        <View
                          style={{
                            borderRadius: 20,
                            margin: 2,
                            backgroundColor: "white",
                            marginTop: 10,
                          }}
                        >
                          <Button
                            title="Modifier le Qr Code"
                            color="#6825B6"
                            onPress={() => {
                              navigation.navigate("ModifierQrCodes", {
                                qrCode: codes[key]["id"],
                              });
                            }}
                          />
                        </View>
                        <View
                          style={{
                            marginTop: 10,
                            borderRadius: 20,
                            backgroundColor: "white",
                          }}
                        >
                          <Button
                            title="Voir Reclamations"
                            color="#6825B6"
                            onPress={() => {
                              navigation.navigate("Reclamations", {
                                qrId: codes[key]["id"],
                              });
                            }}
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          borderRadius: 20,
                          marginTop: 10,
                          backgroundColor: "#6825B6",
                        }}
                      >
                        <Button
                          title="Effectuer une r??clamation"
                          color="white"
                          onPress={() => {
                            navigation.navigate("Reclamations", {
                              qrId: codes[key]["id"],
                            });
                          }}
                        />
                      </View>
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
    backgroundColor: "rgba(29, 46, 54, 1)",
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
    backgroundColor: "rgba(0, 0, 0, 0.43)",
    padding: 20,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    // width: "100%",
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
    // width: "30%",
    padding: 20,
    justifyContent: "center",
  },
  button: {},
});

export default DonneesScreen;
