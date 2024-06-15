import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, FlatList, Image, Text, View } from "react-native";

import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import { useEffect, useState } from "react";
import { getAppointments } from "../../lib/appwrite";

const Home = () => {
  const { user } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAppointments(user);
      console.log("appointment 0:"+response[0].$id);
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

  if (loading)
    return (
      <SafeAreaView className="bg-primary">
        <FlatList
          ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
              <View className="flex justify-between items-start flex-row mb-6">
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
                    className="w-20 h-12"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          )}
        />
        <View className="w-full flex-1 pt-5 pb-8">
          <Text className="font-medium text-sm text-gray-100">Cargando...</Text>
        </View>
      </SafeAreaView>
  );

  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
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
                  className="w-20 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}
      />
      <View className="w-full flex-1 pt-5 pb-8">
        <FlatList
          data = {appointments}
          keyExtractor={(appointment) => appointment.$id}
          renderItem={({appointment}) => (
            <Text className="font-medium text-sm text-gray-100">{appointment.$id}</Text>
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