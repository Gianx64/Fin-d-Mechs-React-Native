import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <View>
          <Text style={styles.normalText}>
            Bienvenid@ de vuelta
          </Text>
          <Text style={{color: "white", fontSize: 16}}>
            {user?.usuario}
          </Text>
        </View>
        <View>
          <Image
            source={images.logo}
            style={[styles.tinyLogo, {alignSelf: "flex-end"}]}
            resizeMode="contain"
          />
        </View>
      </View>
      {appointments && 
        <ScrollView horizontal>
          <View>
            <Text style={[styles.normalText, {width: 150}]}>Fecha y hora</Text>
            <Text style={[styles.normalText, {width: 150}]}>Mecánico</Text>
            <Text style={[styles.normalText, {width: 150}]}></Text>
          </View>
          <FlatList
            data = {appointments}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View>
                <Text style={[styles.normalText, {width: 150}]}>{item.fecha.split(".")[0].split("T")[0]} {item.fecha.split(".")[0].split("T")[1]}</Text>
                <Text style={[styles.normalText, {width: 150}]}>{item.mech_usuario} ({item.mech_correo})</Text>
                <Link
                  style={[styles.normalText, {width: 150}]}
                  href={{ pathname: "/edit", params: item, }}
                >
                  Ver detalles
                </Link>
              </View>
            )}
          />
        </ScrollView>
      }
      {!appointments && <Text style={styles.normalText}>¡Agende una cita con el botón "Crear" en la barra inferior!</Text>}
    </SafeAreaView>
  );
};

export default Home;