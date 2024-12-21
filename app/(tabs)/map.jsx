import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../GlobalProvider";
import { styles } from "../../constants";
import { getWorkshops } from "../../api/apiWorkshops";

export default () => {
  const { setLoading } = useGlobalContext();
  const [granted, setGranted] = useState(false);
  const [workshops, setWorkshops] = useState([]);
  const [ubicacion, setUbicacion] = useState({
      latitude: -33.44,
      longitude: -70.65
  });

  async function getLocationPermission() {
    try {
      setLoading(true);
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
      });
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function getWorkshopsData() {
    try {
      await getWorkshops().then(response => {
        setWorkshops(response);
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }
  useFocusEffect(
    useCallback(() => {
      getLocationPermission();
      setLoading(true);
      const refresh = setTimeout(() => {
        getWorkshopsData();
        setLoading(false);
      }, 1000);
      return () => {
        clearTimeout(refresh);
        setLoading(false);
      };
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
                coordinate={{latitude: parseFloat(workshop.latitud), longitude: parseFloat(workshop.longitud)}}
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
                coordinate={{latitude: parseFloat(workshop.latitud), longitude: parseFloat(workshop.longitud)}}
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
