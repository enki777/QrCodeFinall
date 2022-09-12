import React, { useState, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Button, Text, Platform } from "react-native";
import { doc, db, getDoc } from "../firebase";
import QRCode from "react-native-qrcode-svg";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const EachCodeScreen = ({ navigation, route }) => {
  const svg = useRef();
  // const [selectedPrinter, setSelectedPrinter] = useState();
  const [qrCodeDataId, setQrCodeDataId] = useState();
  const [qrData, setQrData] = useState({});
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [test, setTest] = useState({});

  useLayoutEffect(  () => {
    const unsubscribe = navigation.addListener("focus", () => {
      setQrCodeDataId(route.params.qrId);
      getQrcodeData(route.params.qrId).then((res)=> {
        setQrData(res);
      }).catch((e)=> {
        alert(e)
      });
    });
    return unsubscribe;
  }, [navigation]);

  const getQrcodeData = async (test) => {
    const docRef = doc(db, "QrCode", test);
    const snap = await getDoc(docRef);
    const allData = {
      id: snap.id,
      data: snap.data()
    }
    return allData;
  };

  const DisplayQrCode = () => {
    return (
      <QRCode
        value={JSON.stringify(qrData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
      />
    );
  };

  const print = async () => {
    svg.current.toDataURL((data) => {
      const shareImageBase64 = {
        title: "QR",
        message: "Ehi, this is my QR code",
        url: `data:image/png;base64,${data}`
      };
     setTest(shareImageBase64)
    });
    console.log(test)
    // let filter = test.url;
    await Print.printAsync({
      test,
      printerUrl: selectedPrinter?.url, // iOS only
    });
   
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  }

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
          {/* <DisplayQrCode formData={qrData} /> */}
          {<QRCode
        value={JSON.stringify(qrData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
      />}
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
         {qrData.data != undefined ? (Object.keys(qrData.data).map((key, index) => {
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
                  <Text style={{ color: "orange" }}>{qrData.data[key]}</Text>
                </View>
              </View>
            );
          })) : null}
        </View>
        <View style={{marginTop: 20, backgroundColor: "purple", paddingHorizontal: 10, borderRadius: 20, width: '20%'}}>
          <Button title="Imprimer" color="white" onPress={print}/ >
        </View>
        <View style={{marginTop: 20, backgroundColor: "purple", paddingHorizontal: 10, borderRadius: 20,width: '20%'}}>
        {Platform.OS === 'ios' &&
        <>
          {/* <View style={styles.spacer} /> */}
          <Button title='Choisir imprimante' color="white" onPress={selectPrinter}/>
          {/* <View style={styles.spacer} /> */}
          {selectedPrinter ? <Text>{`Selected printer: ${selectedPrinter.name}`}</Text> : undefined}
        </>
      }
        </View>
      </View>
    </View>
  );
};

export default EachCodeScreen;
