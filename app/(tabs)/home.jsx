import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";
import { AppointmentsComponent, WelcomeBar } from "../../components";

export default () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    setRefreshing(true);
    await getAppointments().then(response => {
      if (response) {
        response.sort((a, b) => b.fecha.localeCompare(a.fecha));
        setAppointments(response);
      }
      setRefreshing(false);
    });
  }
  useFocusEffect(
    useCallback(() => {
      if (user?.rol !== "01")
        fetchAppointments();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <WelcomeBar/>
        <AppointmentsComponent
          refreshing={refreshing}
          list={appointments}
          fetchData={fetchAppointments}
        />
      </View>
    </SafeAreaView>
  );
};
