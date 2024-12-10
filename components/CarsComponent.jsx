import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { styles } from "../constants";

const CarsComponent = ({
  refreshing,
  list,
  fetchData
}) => {
  return (
    <View style={{paddingTop: 16}}>
      <CustomButton
      title={"Registrar auto"}
      containerStyles={{alignSelf: "flex-start"}}
      buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
      handlePress={() => {
        router.push("/carCreate");
      }}
      />
      {list.length > 0 &&
      <View style={{flexDirection: "row", justifyContent: "space-between"}}>
        <Text style={[styles.normalText]}>Patente</Text>
        <Text style={[styles.normalText]}>Marca</Text>
        <Text style={[styles.normalText]}>Modelo</Text>
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
        <Text style={[styles.normalText]}>{item.patente}</Text>
        <Text style={[styles.normalText]}>{item.marca}</Text>
        <Text style={[styles.normalText]}>{item.modelo}</Text>
        <CustomButton
          title={"Editar"}
          buttonStyles={styles.normalButton}
          handlePress={() => {
          router.push({pathname: "/carEdit", params: item});
          }}
        />
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.subtitleText}>¡Registre su auto para pedir una cita!</Text>
      }
      />
    </View>
  );
};

export default CarsComponent;
