import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform } from "react-native";
import MapView from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../../constants";
import { useFocusEffect } from "expo-router";

export default () => {
  const [loading, setLoading] = useState(true);
  const [granted, setGranted] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [ubicacion, setUbicacion] = useState({
      latitude: -33.44,
      longitude: -70.65,
  });

  async function getLocationPermission() {
    await requestForegroundPermissionsAsync().then(petition => {
      if (petition.status !== "granted") {
        setLoading(false);
        Alert.alert("Permiso denegado.");
      }
      setGranted(true);
    });
    setLoading(true);
    await getCurrentPositionAsync().then(location => {
      setUbicacion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    });
  }
  useFocusEffect(
    useCallback(() => {
      getLocationPermission();
    }, [])
  );

  if (loading)
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          animating={loading}
          color="#fff"
          size={Platform.OS === "android" ? 50 : "large"}
          style={styles.loader}
        />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.container}>
      { granted ?
        <MapView
          style={{width: "100%", height: "100%"}}
          provider={"google"}
          showsUserLocation
          showsMyLocationButton
          initialRegion={{
            ...ubicacion,
            latitudeDelta: 0.5,
            longitudeDelta: 0.2,
        }}/>
        :
        <MapView
          style={{width: '100%', height: '100%'}}
          provider={'google'}
          initialRegion={{
            ...ubicacion,
            latitudeDelta: 0.5,
            longitudeDelta: 0.2,
        }}/>
      }
    </SafeAreaView>
  );
};
