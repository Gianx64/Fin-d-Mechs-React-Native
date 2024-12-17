import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, styles } from "../constants";
import { getAdminData } from "../api/apiUsers";
import NotMechsComponent from "../components/NotMechsComponent";
import NotWorkshopsComponent from "../components/NotWorkshopsComponent";

export default () => {
  const [refreshing, setRefreshing] = useState(true);
  const [mechsList, setMechsList] = useState([]);
  const [workshopsList, setWorkshopsList] = useState([]);

  async function fetchAdminData() {
    setRefreshing(true);
    await getAdminData().then(response => {
      if (response) {
        setMechsList(response.mechs);
        setWorkshopsList(response.workshops);
      }
      setRefreshing(false);
    });
  }
  useFocusEffect(
    useCallback(() => {
      fetchAdminData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1, padding: 10}}>
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

        <Text style={styles.titleText}>Panel de Administrador</Text>

        <NotMechsComponent
          containerStyles={{flex: 1}}
          refreshing={refreshing}
          fetchData={fetchAdminData}
          list={mechsList}
        />
        <NotWorkshopsComponent
          containerStyles={{flex: 1}}
          refreshing={refreshing}
          fetchData={fetchAdminData}
          list={workshopsList}
        />
      </View>
    </SafeAreaView>
  );
};
