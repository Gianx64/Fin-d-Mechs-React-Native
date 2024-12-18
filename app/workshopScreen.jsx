import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, styles } from "../constants";
import { CustomButton } from "../components";

export default () => {
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{paddingVertical: 20}}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{flexDirection: "row", justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>
          Detalles de taller
        </Text>
        <Text style={styles.normalText}>
          Dueño:{"\n"}
          Nombre: {params.user_nombre}{"\n"}
          Celular: {params.user_celular}{"\n"}
          Correo: {params.user_correo}{"\n"}
        </Text>
        <Text style={styles.normalText}>
          Taller:{"\n"}
          Nombre: {params.nombre}{"\n"}
          Comuna: {params.ciudad}{"\n"}
          Dirección: {params.direccion}{"\n"}
          Ubicación: {params.latitud}, {params.longitud}{"\n"}
          Detalles: {params.detalles}{"\n"}
        </Text>
        <CustomButton
          title="Agendar cita en este taller"
          handlePress={() => router.push({pathname: "/appointmentCreate", params: params})}
          containerStyles={{paddingBottom: 40, paddingTop: 20}}
          buttonStyles={styles.mainButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
