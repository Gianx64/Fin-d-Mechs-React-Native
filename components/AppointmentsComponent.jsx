import { FlatList, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { useGlobalContext } from "../app/GlobalProvider";
import { styles } from "../constants";
import { router } from "expo-router";

const AppointmentsComponent = ({
  containerStyles,
  fetchData,
  list,
  refreshing
}) => {
  const { user } = useGlobalContext();
  if (user?.rol === "01")
    return (
      <Text style={[styles.titleText, {paddingTop: 200}]}>
        Para empezar a aceptar citas debe ser verificado por un administrador.
      </Text>
    );
  return (
    <View style={containerStyles}>
      {(user?.rol === "11" || user?.rol === "00") &&
        <CustomButton
          title={"Agendar cita"}
          containerStyles={{alignSelf: "flex-start"}}
          buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
          handlePress={() => {
            router.push("/appointmentCreate");
          }}
        />
      }
      {list.length > 0 &&
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.normalText]}>Fecha y hora</Text>
          <Text style={[styles.normalText]}>Estado</Text>
          <Text style={[styles.normalText]}>Detalles</Text>
        </View>
      }
      <FlatList
        refreshing={refreshing}
        onRefresh={fetchData}
        data = {list}
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
  );
};

export default AppointmentsComponent;
