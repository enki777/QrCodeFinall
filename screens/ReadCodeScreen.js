import { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ReadCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [cameraType, setCameraType] = useState('back');

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

  const handleChangeCamera = ()=> {
    if(cameraType == 'back'){
      setCameraType('front')
    }else{
      setCameraType('back')
    }
    // console.log(cameraType)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
      type={cameraType}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Appuyer pour scanner de nouveau"} onPress={() => setScanned(false)} />
      )}
      <View style={{backgroundColor: "orange", alignItems: 'center'}}>
        <TouchableOpacity onPress={handleChangeCamera}>
          <MaterialCommunityIcons name="camera-flip" size={50} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(18, 16, 11, 1)",
    justifyContent: "space-between"
  },
});

export default ReadCodeScreen;
