import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../../constants";
import { router, useFocusEffect } from "expo-router";
import { useGlobalContext } from "../../api/GlobalProvider";

export default () => {
  const { setLoading } = useGlobalContext();
  const [granted, setGranted] = useState(false);
  const [workshops, setWorkshops] = useState([{id: 0, nombre: "Eso tilín", coords: {
    latitude: -33.44,
    longitude: -70.65
}}]);
  const [ubicacion, setUbicacion] = useState({
      latitude: -33.44,
      longitude: -70.65
  });

  async function getLocationPermission() {
    try {
      await requestForegroundPermissionsAsync().then(petition => {
        if (petition.status !== "granted") {
          setLoading(false);
          throw new Error("Permiso denegado.");
        }
        setGranted(true);
      });
      await getCurrentPositionAsync().then(location => {
        setUbicacion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setLoading(false);
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  }
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getLocationPermission();
    }, [])
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
            latitudeDelta: 0.21,
            longitudeDelta: 0.05,
        }}>
          {workshops.map((workshop) => {
            return (
              <Marker
                key={workshop.id}
                pinColor="blue"
                coordinate={workshop.coords}
                title={`Taller: ${workshop.nombre}`}
                description="Ver detalles."
              >
                <Callout onPress= {() => router.push({pathname: "/workshopScreen", params: workshop})}/>
              </Marker>
            ) 
          })}
        </MapView>
        :
        <MapView
          style={{width: "100%", height: "100%"}}
          provider={"google"}
          initialRegion={{
            ...ubicacion,
            latitudeDelta: 0.5,
            longitudeDelta: 0.2,
        }}>
          {workshops.map((workshop) => {
            return (
              <Marker
                key={workshop.id}
                pinColor="blue"
                coordinate={workshop.coords}
                title={`Taller: ${workshop.nombre}`}
                description="Ver detalles."
              >
                <Callout onPress= {() => router.push({pathname: "/workshopScreen", params: workshop})}/>
              </Marker>
            ) 
          })}
        </MapView>
      }
      <Callout style={{borderWidth: 0.5, borderRadius: 100, paddingTop: 40, paddingLeft: 10}}>
        <TouchableOpacity
          style={{backgroundColor: "lightblue", padding: 8}}
          onPress={() => Alert.alert("Información", 'Los pines azules son ubicaciones de talleres.\nPara ver los detalles de un taller, toque el pin que desee y luego el texto "Taller: ...".')}
        >
          <Text style={{fontSize: 16}}>Ayuda</Text>
        </TouchableOpacity>
      </Callout>
    </SafeAreaView>
  );
};
