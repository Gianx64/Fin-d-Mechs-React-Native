import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../components";
import { icons, styles } from "../constants";
import { setMech } from "../api/apiUsers";

export default () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();

  const submit = async () => {
    setSubmitting(true);
    await setMech(params.id).then(response => {
      if (response)
        router.back();
      setSubmitting(false);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => {router.back()}}
          style={{flexDirection:'row', justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        <Text style={styles.titleText}>
          Revisar Mech
        </Text>

        <Text style={styles.normalText}>
          Nombre: {params.nombre}
        </Text>

        <Text style={styles.normalText}>
          Celular: {params.celular}
        </Text>

        <Text style={styles.normalText}>
          Correo: {params.correo}
        </Text>

        { params.verificado &&
          <Text style={styles.normalText}>
            Fecha de verificación: {params.verificado.split(".")[0].split("T")[0]} {params.verificado.split(".")[0].split("T")[1]}
          </Text>
        }
        { !params.verificado &&
          <Text style={styles.normalText}>
            Usuario sin verificación.
          </Text>
        }

        <CustomButton
          title="Promover"
          handlePress={submit}
          containerStyles={{paddingBottom: 40, paddingTop: 20}}
          buttonStyles={styles.mainButton}
          isLoading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
