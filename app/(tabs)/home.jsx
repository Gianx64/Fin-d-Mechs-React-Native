import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, Text, View } from "react-native";

import { useGlobalContext } from "../../context/GlobalProvider";
import { getAppointments } from "../../lib/appwrite";
import { images } from "../../constants";

const Home = () => {
  const { user } = useGlobalContext();
  const appointments = getAppointments();

  console.log(user?.email+" appointments: "+appointments[0]);
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
      <View>
        {/*appointments*/}
      </View>
    </SafeAreaView>
  );
};

export default Home;