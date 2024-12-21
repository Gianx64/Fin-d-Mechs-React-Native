import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../GlobalProvider";
import { styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { AppointmentsComponent, WelcomeBar } from "../../components";

export default () => {
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    await getAppointments().then(response => {
      if (response) {
        response.sort((a, b) => b.fecha.localeCompare(a.fecha));
        setAppointments(response);
      }
    });
  }
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const refresh = setTimeout(() => {
        if (user?.rol !== "01")
          fetchAppointments();
        setRefreshing(false);
      }, 1000);
      return () => {
        clearTimeout(refresh);
        setRefreshing(false);
      };
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
