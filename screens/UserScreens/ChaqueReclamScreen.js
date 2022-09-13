import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const ChaqueReclamScreen = ({ navigation, route }) => {
  const [reclam, setReclam] = useState({});

  useEffect(() => {
    // console.log(route);
    getQrById(route.params.reclamId);
  }, []);

  const getQrById = async (id) => {
    const docRef = doc(db, "Reclamation", id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    setReclam(docSnap.data());
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
        {Object.keys(reclam).map((key, index) => {
          return (
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
              }}
            >
              <Text style={{ color: "white" }}>{key}</Text>
              <Text style={{ color: "orange" }}>{reclam[key]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default ChaqueReclamScreen;
