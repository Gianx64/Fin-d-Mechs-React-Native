import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { styles } from "../constants";

const WorkshopsComponent = ({
  refreshing,
  list,
  fetchData
}) => {
  return (
    <View style={{paddingTop: 16}}>
      <CustomButton
      title={"Registrar taller"}
      containerStyles={{alignSelf: "flex-start"}}
      buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
      handlePress={() => {
        router.push("/workshopCreate");
      }}
      />
      {list.length > 0 &&
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={[styles.normalText]}>Nombre</Text>
        <Text style={[styles.normalText]}>Verificado</Text>
        <Text style={[styles.normalText]}>Acción</Text>
      </View>
      }
      <FlatList
      refreshing={refreshing}
      onRefresh={fetchData}
      data = {list}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => (
        <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={[styles.normalText]}>{item.nombre}</Text>
        <Text style={[styles.normalText]}>{item.verificado ? "Sí" : "No"}</Text>
        <CustomButton
          title={"Editar"}
          buttonStyles={styles.normalButton}
          handlePress={() => router.push({pathname: "/workshopEdit", params: item})}
        />
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.subtitleText}>¡Registre su taller para que le agenden citas!</Text>
      }
      />
    </View>
  );
};

export default WorkshopsComponent;
