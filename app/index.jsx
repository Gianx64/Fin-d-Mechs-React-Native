import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, Loader } from "../components";
import { images, styles } from "../constants";
import { useGlobalContext } from "../api/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            style={styles.tinyLogo}
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Ahórrate problemas,{"\n"}
              llama a un mecánico en {" "}
              <Text className="text-secondary-200">Fin-d-Mechs</Text>
            </Text>
          </View>

          <Text className="text-sm text-gray-100 mt-7 text-center">
            Agendamientos a domicilio o en taller,{"\n"}dependiendo de sus necesidades.
          </Text>

          <CustomButton
            title="Continuar con Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
