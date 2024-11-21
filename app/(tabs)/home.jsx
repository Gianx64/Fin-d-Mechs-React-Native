import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";
import CustomButton from "../../components/CustomButton";

const Home = () => {
  const { user, setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      if (response)
        setAppointments(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <View>
            <Text style={styles.normalText}>
              Bienvenid@ de vuelta
            </Text>
            <Text style={{color: "white", fontSize: 16}}>
              {user?.nombre}
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
        <CustomButton
          title={"Crear cita"}
          buttonStyles={styles.normalButton}
          handlePress={() => {
            router.push("/create");
          }}
        />
        {appointments.length > 0 &&
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={[styles.normalText]}>Fecha y hora</Text>
            <Text style={[styles.normalText]}>Mecánico</Text>
            <Text style={[styles.normalText]}>Detalles</Text>
          </View>
        }
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefresh}
          data = {appointments}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={[styles.normalText]}>{item.fecha.split(".")[0].split("T")[0]} {item.fecha.split(".")[0].split("T")[1]}</Text>
              <Text style={[styles.normalText]}>{item.mech_usuario ? item.mech_usuario+"("+item.mech_correo+")" : "Sin mech"}</Text>
              <Link
                style={[styles.normalText]}
                href={{pathname: "/editAppointment", params: item}}
              >
                Ver
              </Link>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.normalText, {flex: 1}]}>¡Agende una cita con el botón "Crear" en la barra inferior!</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;