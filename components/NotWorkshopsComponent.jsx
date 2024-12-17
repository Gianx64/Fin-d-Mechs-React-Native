import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { styles } from "../constants";

const NotWorkshopsComponent = ({
  containerStyles,
  fetchData,
  list,
  refreshing
}) => {
  return (
    <View style={[containerStyles, {paddingTop: 16}]}>
      <Text style={styles.titleText}>Talleres a verificar.</Text>
      {list.length > 0 &&
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.normalText]}>Dueño</Text>
          <Text style={[styles.normalText]}>Comuna</Text>
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
            <Text style={[styles.normalText, {fontSize: 12}]}>{item.user_nombre}</Text>
            <Text style={[styles.normalText]}>{item.comuna}</Text>
            <CustomButton
              title={"Revisar"}
              buttonStyles={styles.normalButton}
              handlePress={() => {
                router.push({pathname: "/reviewWorkshop", params: item});
              }}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.subtitleText}>¡No quedan talleres para verificar!</Text>
        }
      />
    </View>
  );
};

export default NotWorkshopsComponent;
