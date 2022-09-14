import { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase";
import { collection, doc, query, where, getDocs } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

const ReclamationsScreen = ({ navigation, route }) => {
  const [reclamations, setReclamations] = useState([]);
  const [qrId, setQrId] = useState("");
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // console.log(route.params);
      setQrId(route.params.qrId);
      gatAllReclamations(route.params.qrId);
      // console.log("TOUTES LES RECLAMS : ===>" + reclamations);
    });
    return unsubscribe;
  }, [navigation]);

  const gatAllReclamations = async (qrId) => {
    if (qrId != "") {
      // console.log(qrId);
      const q = query(collection(db, "Reclamation"), where("qrId", "==", qrId));
      const querySnapshot = await getDocs(q);
      let test = [];
      querySnapshot.forEach((doc) => {
        test.push({ id: doc.id, data: doc.data() });
      });
      setReclamations(test);
      setCount(test.length);
    }
  };

  const eachReclamation = async (reclamId) => {
    // console.log(reclamId);
    navigation.navigate("ChaqueReclam", {
      reclamId: reclamId,
    });
  };

  return (
    <View
      style={{
        backgroundColor: "rgba(29, 46, 54, 1)",
        flex: 1,
        alignItems: "center",
        // width: "100%",
      }}
    >
      <View
        style={{
          flex: 4,
          alignItems: "center",
          marginTop: 40,
          padding: 10,
          borderRadius: 5,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          width: "90%",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            marginBottom: 10,
            color: "orange",
          }}
        >
          Toutes les réclamations concernant ce Qr code :
        </Text>
        <ScrollView>
          {Object.keys(reclamations).map((key, index) => {
            return (
              <View key={index} style={{ flexDirection: "row", width: "100%" }}>
                <View style={{ width: "85%" }}>
                  {reclamations[key].data.isDone ? (
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "grey",
                        padding: 10,
                        justifyContent: "space-between",
                        borderRadius: 5,
                        margin: 10,
                      }}
                      onPress={() => {
                        eachReclamation(reclamations[key].id);
                      }}
                      key={key}
                    >
                      <Text>Motif : </Text>
                      <Text>{reclamations[key].data.motif}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        backgroundColor: "lightgrey",
                        padding: 10,
                        justifyContent: "space-between",
                        borderRadius: 5,
                        margin: 10,
                      }}
                      onPress={() => {
                        eachReclamation(reclamations[key].id);
                      }}
                      key={key}
                    >
                      <Text>Motif : </Text>
                      <Text>{reclamations[key].data.motif}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  style={{
                    width: "10%",
                    // backgroundColor: "blue",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: 5,
                    borderRadius: 5,
                  }}
                >
                  {reclamations[key].data.isDone ? (
                    <Text style={{ color: "red" }}>cloturée</Text>
                  ) : (
                    <Text style={{ color: "green" }}>en cours</Text>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View
        style={{
          flex: 1,
          marginTop: 10,
          borderRadius: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("CreerReclam", {
              qrId: qrId,
            });
          }}
        >
          <AntDesign name="pluscircle" size={40} color="#6825B6" />
        </TouchableOpacity>
        <View
          style={{
            // flex: 1,
            // backgroundColor: "white",
            paddingLeft: 5,
            paddingRight: 5,
            borderRadius: 5,
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "orange" }}>
            nombre de réclamations: {count}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>{/* <Text>salut</Text> */}</View>
    </View>
  );
};

export default ReclamationsScreen;
