import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";
import CustomButton from "../../components/CustomButton";

export default () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    setRefreshing(true);
    if (user?.rol !== "01")
      await getAppointments().then(response => {
        if (response)
          response.sort((a, b) => b.fecha.localeCompare(a.fecha));
          setAppointments(response);
        setRefreshing(false);
      });
  }
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

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
              source={icons.logo}
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
        { user?.rol !== "01" ?
          <View>
            {appointments.length > 0 &&
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={[styles.normalText]}>Fecha y hora</Text>
                <Text style={[styles.normalText]}>Estado</Text>
                <Text style={[styles.normalText]}>Detalles</Text>
              </View>
            }
            <FlatList
              refreshing={refreshing}
              onRefresh={fetchAppointments}
              data = {appointments}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                  <Text style={[styles.normalText]}>{item.fecha.split(".")[0].split("T")[0]} {item.fecha.split(".")[0].split("T")[1]}</Text>
                  <Text style={[styles.normalText]}>{item.completado ? "Completado" : item.cancelado ? "Cancelado" : item.confirmado ? "Confirmado" : "Publicado"}</Text>
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
                    <Text style={styles.subtitleText}>¡Agende una cita tocando el botón "Agendar cita"!</Text>
                  }
                  { user?.rol === "10" &&
                    <Text style={styles.subtitleText}>¡Aún no hay citas para aceptar! Recargue la lista arrastrando este texto hacia abajo.</Text>
                  }
                </>
              }
            />
          </View>
          :
          <Text style={[styles.titleText, {paddingTop: 200}]}>Para empezar a aceptar citas debe ser verificado por un administrador.</Text>
        }
      </View>
    </SafeAreaView>
  );
};
