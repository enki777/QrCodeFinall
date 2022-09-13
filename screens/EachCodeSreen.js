import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { StyleSheet, View, Button, Text, Platform } from "react-native";
import { doc, db, getDoc } from "../firebase";
import QRCode from "react-native-qrcode-svg";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { TouchableOpacity } from "react-native-gesture-handler";

const EachCodeScreen = ({ navigation, route }) => {
  const svg = useRef(null);
  const [qrCodeDataId, setQrCodeDataId] = useState();
  const [qrData, setQrData] = useState({});
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [test, setTest] = useState({});

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrCodeDataId(route.params.qrId);
      getQrcodeData(route.params.qrId)
        .then((res) => {
          setQrData(res);
        })
        .catch((e) => {
          alert(e);
        });

      if (svg.current == null) {
        console.log(svg.current);
      }
    });

    return unsubscribe;
  }, [navigation]);

  const getQrcodeData = async (test) => {
    const docRef = doc(db, "QrCode", test);
    const snap = await getDoc(docRef);
    const allData = {
      id: snap.id,
      data: snap.data(),
    };
    return allData;
  };

  const DisplayQrCode = () => {
    return (
      <QRCode
        value={JSON.stringify(qrData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
        color="rgba(20, 32, 37, 1)"
        backgroundColor="white"
      />
    );
  };

  const print = async () => {
    svg.current.toDataURL((data) => {
      // const shareImageBase64 = {
      //   title: "QR",
      //   message: "Ehi, this is my QR code",
      //   url: `data:image/png;base64,${data}`,
      // };
      // setTest(data);
      Print.printAsync({
        html: `
        <html style="background-color: rgba(29, 46, 54, 1);">
            <body>
              <div style="display: flex; flex-direction: column; align-items: center;margin-top: 40px">
                <div style="padding: 10px; border-radius: 10px; background-color: white ">
                  <img src="data:image/png;base64,${data}" width="400" height="400" />
                </div>
                <div style="display: flex;flex-direction: row;justify-content: space-between; align-items: flex-start; background-color: rgba(0, 0, 0, 0.43); width: 80%; margin-top: 30px; padding: 10px; border-radius: 5px;">
                  <div style="color: white;">
                    <p>QrCode_ID : </p>
                    <p>codeEcran</p>
                    <p>codeEcran2</p>
                    <p>emplacement</p>
                  </div>
                  <div style="color: orange;">
                    <p>${qrData.id}</p>
                    <p>${qrData.data.codeEcran}</p>
                    <p>${qrData.data.codeEcran2}</p>
                    <p>${qrData.data.emplacement}</p>
                    
                  </div>
                </div>
              <div>
            </body>
        </html>
        `,
        orientation: "portrait",
        printerUrl: selectedPrinter?.url,
        // margins: {
        //   left: 20,
        //   top: 20,
        //   right: 20,
        //   bottom: 20,
        // },
      })
        .then((res) => {
          console.log("ca marche bien ! ");
        })
        .catch((err) => {
          return;
        });
    });
  };

  // IOS SEULEMENT
  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync();
    setSelectedPrinter(printer);
  };

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
          style={{
            padding: 10,
            backgroundColor: "rgba(20, 32, 37, 1)",
            borderRadius: 5,
          }}
        >
          {<DisplayQrCode />}
          {/* {
            <QRCode
              value={JSON.stringify(qrData)}
              size={300}
              getRef={(ref) => (svg.current = ref)}
            />
          } */}
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
          {qrData.data != undefined
            ? Object.keys(qrData.data).map((key, index) => {
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
                      <Text style={{ color: "orange" }}>
                        {qrData.data[key]}
                      </Text>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: "#6825B6",
            paddingHorizontal: 10,
            borderRadius: 20,
            width: "30%",
          }}
        >
          <Button raised title="Imprimer" color="white" onPress={print} />
        </View>
        {Platform.OS === "ios" && (
          <View
            style={{
              marginTop: 20,
              backgroundColor: "#6825B6",
              paddingHorizontal: 10,
              borderRadius: 20,
              width: "30%",
            }}
          >
            <Button
              raised
              title="Choisir imprimante"
              color="white"
              onPress={selectPrinter}
            />

            {selectedPrinter ? (
              <Text>{`Selected printer: ${selectedPrinter.name}`}</Text>
            ) : undefined}
          </View>
        )}
      </View>
    </View>
  );
};

export default EachCodeScreen;
