import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";
import CustomButton from "../../components/CustomButton";

export default () => {
  const { user, setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
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
    fetchAppointments();
  }, []);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
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
        {(user?.rol === "11" || user?.rol === "00") &&
          <View style={{alignItems: "flex-start"}}>
            <CustomButton
              title={"Agendar cita"}
              buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
              handlePress={() => {
                router.push("/appointmentCreate");
              }}
            />
          </View>
        }
        <View>
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
              <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={[styles.normalText]}>{item.fecha.split(".")[0].split("T")[0]} {item.fecha.split(".")[0].split("T")[1]}</Text>
                <Text style={[styles.normalText]}>{item.mech_usuario ? item.mech_usuario+"("+item.mech_correo+")" : "Sin mech"}</Text>
                <CustomButton
                  title={"Ver"}
                  buttonStyles={styles.normalButton}
                  handlePress={() => {
                    router.push({pathname: "/appointmentEdit", params: item});
                  }}
                />
              </View>
            )}
            ListEmptyComponent={
              <>
                {(user?.rol === "11" || user?.rol === "00") &&
                  <Text style={[styles.normalText, {flex: 1}]}>¡Agende una cita tocando el botón "Agendar cita"!</Text>
                }
                { user?.rol === "10" &&
                  <Text style={[styles.normalText, {flex: 1}]}>¡Aún no hay citas para aceptar! Recargue la lista arrastrando este texto hacia abajo.</Text>
                }
              </>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
