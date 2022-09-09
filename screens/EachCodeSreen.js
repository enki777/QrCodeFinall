import React, { useState, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { doc, db, getDoc } from "../firebase";

const EachCodeScreen = ({ navigation, route }) => {
  const svg = useRef();
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [qrCodeDataId, setQrCodeDataId] = useState();
  const [qrData, setQrData] = useState({});

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrCodeDataId(route.params.qrCode);
      getQrDoc(route.params.qrCode).then((res) => {
        console.log(res);
        setQrData(res);
      });
    });
    return unsubscribe;
  }, [navigation]);

  const getQrDoc = async (id) => {
    const docRef = doc(db, "QrCode", id);
    const snap = await getDoc(docRef);
    return snap.data();
  };

  const DisplayQrCode = ({ formData }) => {
    return (
      <QRCode
        value={JSON.stringify(formData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
      />
    );
  };

  // const printQrCode = async () => {
  //   const test = svg.current;

  //   test.toDataURL((data) => {
  //     const shareImageBase64 = {
  //       title: "QR",
  //       message: "Ehi, this is my QR code",
  //       url: `data:image/png;base64,${data}`,
  //     };
  //     Share.open(shareImageBase64);
  //   });
  // };

  return (
    <View
      style={{
        backgroundColor: "rgba(29, 46, 54, 1)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(29, 46, 54, 1)",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{ padding: 10, backgroundColor: "white", borderRadius: 5 }}
        >
          <DisplayQrCode formData={qrCodeDataId} />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(29, 46, 54, 1)",
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {/* //CARD CONTAINER */}
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.43)",
            width: "60%",
            borderRadius: 5,
            padding: 10,
          }}
        >
          {Object.keys(qrData).map((key, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  // backgroundColor: "rgba(0, 0, 0, 0.43)",
                }}
              >
                <View>
                  <Text style={{ color: "white" }}>{key}</Text>
                </View>
                <View>
                  <Text style={{ color: "orange" }}>{qrData[key]}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default EachCodeScreen;
