import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, Loader } from "../components";
import { colors, images, styles } from "../constants";
import { useGlobalContext } from "../api/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={[styles.container, {paddingVertical: 100}]}>
      <Loader isLoading={loading} />

      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View>
          <Image
            source={images.logo}
            style={styles.welcomeLogo}
            resizeMode="contain"
          />

          <View>
            <Text style={styles.welcomeText1}>
              Ahórrate problemas,{"\n"}
              llama a un mecánico en{"\n"}
              <Text style={{color: colors.secondary[200]}}>Fin-d-Mechs</Text>
            </Text>
          </View>

          <Text style={styles.subtitleText}>
            Agendamientos a domicilio o en taller,{"\n"}
            dependiendo de sus necesidades.
          </Text>

          <CustomButton
            title="Continuar con Email"
            handlePress={() => router.push("/sign-in")}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
