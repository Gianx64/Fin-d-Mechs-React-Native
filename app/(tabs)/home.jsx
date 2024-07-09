import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, FlatList, Image, Text, View } from "react-native";
import { Link } from "expo-router";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { useEffect, useState } from "react";
import { getAppointments } from "../../lib/appwrite";

const Home = () => {
  const { user, appointments, setAppointments } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  //const [appointments, setAppointments] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppointments(user);
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
    <SafeAreaView className="bg-primary h-screen">
      <View className="flex my-6 px-4">
        <View className="flex justify-between items-start flex-row">
          <View>
            <Text className="font-medium text-sm text-gray-100">
              Bienvenid@ de vuelta
            </Text>
            <Text className="text-2xl font-semibold text-white">
              {user?.username}
            </Text>
          </View>
          <View>
            <Image
              source={images.logo}
              className="w-40 h-24"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      <View className="h-max place-content-center">
        <FlatList
          data = {appointments}
          keyExtractor={(item) => item.$id}
          renderItem={({item}) => (
            <View className="flex-col pt-5">
              <Text className="font-medium text-sm text-gray-100">{item.date}, {item.user}, {item.car_model}, {item.mech}</Text>
              <Link
                className="font-medium text-sm text-gray-100"
                href={{
                  pathname: "/edit",
                  params: { id: item.$id, user: item.user, date: item.date, city: item.city, address: item.address, car_make: item.car_make, car_model: item.car_model, description: item.description, service: item.service, workshop_id: item.workshop_id, mech: item.mech },
                }}
              >
                Go to Details
              </Link>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="font-medium text-sm text-gray-100">¡Agende una cita con el botón "Crear" en la barra inferior!</Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;