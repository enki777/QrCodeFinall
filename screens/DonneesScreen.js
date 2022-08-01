import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Button,
  RefreshControl,
} from "react-native";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonneesScreen = ({ navigation }) => {
  const [message, setMessage] = useState(null);
  const [codes, setCodes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdminTest] = useState(false);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCodes().then((res) => {
        setCodes(res);
      });

      getData("isAdmin").then((res) => {
        console.log(res);
        if (res == null) {
          // console.log("c'est vrai");
          setIsAdminTest(false);
          console.log(isAdmin);
        } else if (res.isAdmin != true) {
          setIsAdminTest(false);
        } else if (res.isAdmin == true) {
          setIsAdminTest(true);
        }
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

  return (
    <SafeAreaView>
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
                    {isAdmin ? (
                      <Button
                        title="Modifier le Qr Code"
                        color="purple"
                        onPress={() => {
                          // navigation.navigate("EachCode", {
                          //   qrCode: codes[key]["id"],
                          // });
                        }}
                      />
                    ) : (
                      <Button
                        title="Effectuer une réclamation"
                        color="purple"
                        onPress={HandleReclamation}
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
