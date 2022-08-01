import React, { useState, useLayoutEffect, useRef } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import QRCode from "react-native-qrcode-svg";

const EachCodeScreen = ({ navigation, route }) => {
  const svg = useRef();
  const [selectedPrinter, setSelectedPrinter] = useState();
  const [qrCodeData, setQrCodeData] = useState();
  useLayoutEffect(() => {
    console.log(route.params.qrCode);
    setQrCodeData(route.params.qrCode);
  }, []);

  const DisplayQrCode = ({ formData }) => {
    return (
      <QRCode
        value={JSON.stringify(formData)}
        size={300}
        getRef={(ref) => (svg.current = ref)}
      />
    );
  };

  const printQrCode = async () => {
    const test = svg.current;
    console.log(test);
    test.toDataURL((data) => {
      console.log(data);
      const shareImageBase64 = {
        title: "QR",
        message: "Ehi, this is my QR code",
        url: `data:image/png;base64,${data}`,
      };
      Share.open(shareImageBase64);
    });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <DisplayQrCode formData={qrCodeData} />
    </View>
  );
};

export default EachCodeScreen;
