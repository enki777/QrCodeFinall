import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChaqueReclamScreen = ({ navigation, route }) => {
  const [reclamData, setReclamData] = useState({});
  const [reclamId, setReclamId] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getData("isAdmin").then((res) => setIsAdmin(res));
      getQrById(route.params.reclamId);
    });

    return unsubscribe;
  }, [navigation]);

  const getQrById = async (id) => {
    const docRef = doc(db, "Reclamation", id);
    const docSnap = await getDoc(docRef);
    setReclamData(docSnap.data());
    setReclamId(docSnap.id);
  };

  const getData = async (itemKey) => {
    try {
      const jsonValue = await AsyncStorage.getItem(itemKey);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const handleCloseReclam = async () => {
    console.log(reclamId);
    const washingtonRef = doc(db, "Reclamation", reclamId);
    await updateDoc(washingtonRef, {
      isDone: true,
    });

    Alert.alert(`La réclamation : ${reclamData.motif} \n a bien été cloturée`);
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(29, 46, 54, 1)",
        alignItems: "center",
        justfiContent: "flex-start",
        padding: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          padding: 10,
          alignItems: "center",
          borderRadius: 4,
        }}
      >
        {Object.keys(reclamData).map((key, index) => {
          return key == "isDone" ? null : (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // backgroundColor: "white",
                margin: 10,
                width: "100%",
                borderRadius: 4,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "rgba(0,0,0,0.55)",
              }}
            >
              <Text style={{ color: "white" }}>{key}</Text>
              <Text style={{ color: "orange" }}>{reclamData[key]}</Text>
            </View>
          );
        })}
      </View>

      {isAdmin && (
        <View>
          <Button
            title="Cloturer cette réclamation"
            onPress={handleCloseReclam}
          />
        </View>
      )}
    </View>
  );
};

export default ChaqueReclamScreen;
