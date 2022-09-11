import { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { View, Text, StyleSheet, Button, Alert } from "react-native";

const ReadCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    let formatedData = JSON.parse(data);
    // return console.log(formatedData)
    
    setScanned(true);
    navigation.navigate("EachCode", {
      qrId: formatedData.id,
    });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
      type={'front'}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Appuyer pour scanner de nouveau"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(18, 16, 11, 1)",
  },
});

export default ReadCodeScreen;
