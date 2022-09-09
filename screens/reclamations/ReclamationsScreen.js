import { useLayoutEffect, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../firebase";
import { collection, doc, query, where, getDocs } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

const ReclamationsScreen = ({ navigation, route }) => {
  const [reclamations, setReclamations] = useState([]);
  const [qrId, setQrId] = useState();
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrId(route.params.qrCode);
      gatAllReclamations(route.params.qrCode);
      // console.log("TOUTES LES RECLAMS : ===>" + reclamations);
    });
    return unsubscribe;
  }, [navigation]);

  const gatAllReclamations = async (qrId) => {
    if (qrId != "") {
      console.log(qrId);
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
      }}
    >
      <ScrollView
        style={{
          flex: 4,
          marginTop: 40,
          padding: 10,
          borderRadius: 5,
          backgroundColor: "white",
          width: "90%",
          // height: "20%",
        }}
      >
        <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 10 }}>
          Toutes les réclamations concernant ce Qr code :
        </Text>
        {Object.keys(reclamations).map((key) => {
          return (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                backgroundColor: "lightgrey",
                padding: 10,
                width: "100%",
                borderRadius: 5,
                marginTop: 5,
              }}
              onPress={() => {
                eachReclamation(reclamations[key].id);
              }}
              key={key}
            >
              <Text>ID: </Text>
              <Text>{reclamations[key].id}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        style={{
          // flex: 1,
          marginTop: 10,
          // padding: 10,
          borderRadius: 5,
          // backgroundColor: "white",
          flexDirection: "row",
          // alignItems: "flex-start",
          justifyContent: "space-between",
          width: "90%",
          // height: "100%",
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            navigation.navigate("CreerReclam");
          }}
        >
          <AntDesign name="pluscircle" size={60} color="purple" />
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
          <Text style={{ color: "orange" }}>nb de réclamations: {count}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>{/* <Text>salut</Text> */}</View>
    </View>
  );
};

export default ReclamationsScreen;
