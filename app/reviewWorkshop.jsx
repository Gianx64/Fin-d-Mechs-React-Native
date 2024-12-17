import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton } from "../components";
import { icons, styles } from "../constants";
import { upgradeWorkshop } from "../api/apiWorkshops";

export default () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();

  const submit = async () => {
    setSubmitting(true);
    await upgradeWorkshop(params.id).then(response => {
      if (response)
        router.back();
      setSubmitting(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding: 10}}>
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
          Revisar Taller
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
          Ubicación: {params.ubicacion}{"\n"}
          Detalles: {params.detalles}{"\n"}
        </Text>

        <CustomButton
          title="Verificar"
          handlePress={submit}
          containerStyles={{paddingBottom: 40, paddingTop: 20}}
          buttonStyles={styles.mainButton}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
