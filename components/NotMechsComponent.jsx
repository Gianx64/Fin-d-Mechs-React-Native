import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { styles } from "../constants";

const NotMechsComponent = ({
  containerStyles,
  fetchData,
  list,
  refreshing
}) => {
  return (
    <View style={[containerStyles, {paddingTop: 16}]}>
      <Text style={styles.titleText}>Mecánicos a verificar.</Text>
      {list.length > 0 &&
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.normalText]}>Nombre</Text>
          <Text style={[styles.normalText]}>Correo{"\n"}Verificado</Text>
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
            <Text style={[styles.normalText, {fontSize: 12}]}>{item.nombre}</Text>
            <Text style={[styles.normalText]}>{item.verificado ? "Sí" : "No"}</Text>
            <CustomButton
              title={"Revisar"}
              buttonStyles={styles.normalButton}
              handlePress={() => {
                router.push({pathname: "/reviewMech", params: item});
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.subtitleText}>¡No quedan mechs para verificar!</Text>
        }
      />
    </View>
  );
};

export default NotMechsComponent;
