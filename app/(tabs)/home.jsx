import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images, styles } from "../../constants";
import { getAppointments } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";

const Home = () => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppointments();
      setAppointments(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex my-6 px-4">
        <View className="flex justify-between items-start flex-row">
          <View>
            <Text className="font-medium text-sm text-gray-100">
              Bienvenid@ de vuelta
            </Text>
            <Text className="text-2xl font-semibold text-white">
              {user?.usuario}
            </Text>
          </View>
          <View>
            <Image
              source={images.logo}
              style={styles.tinyLogo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <ScrollView horizontal>
        <View>
          <Text className="font-medium text-sm text-gray-100" style={{width: 150}}>Fecha y hora</Text>
          <Text className="font-medium text-sm text-gray-100" style={{width: 150}}>Mecánico</Text>
          <Text className="font-medium text-sm text-gray-100" style={{width: 150}}></Text>
        </View>
        <FlatList
          data = {appointments}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <View className="flex-col pt-5">
              <Text className="font-medium text-sm text-gray-100" style={{width: 150}}>{item.fecha.split(".")[0].split("T")[0]} {item.fecha.split(".")[0].split("T")[1]}</Text>
              <Text className="font-medium text-sm text-gray-100" style={{width: 150}}>{item.mech_usuario} ({item.mech_correo})</Text>
              <Link
                className="font-medium text-sm text-gray-100"
                style={{width: 150}}
                href={{
                  pathname: "/edit",
                  params: item,
                }}
              >
                Ver detalles
              </Link>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="font-medium text-sm text-gray-100">¡Agende una cita con el botón "Crear" en la barra inferior!</Text>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;