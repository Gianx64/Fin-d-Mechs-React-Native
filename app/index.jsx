import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, Image, ActivityIndicator, Platform, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../components";
import { colors, images, styles } from "../constants";
import { useGlobalContext } from "../api/GlobalProvider";

export default () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{justifyContent: "center", height: Dimensions.get("window").height-20}}>
          <Image
            source={images.logo}
            style={styles.welcomeLogo}
            resizeMode="contain"
          />

          <Text style={styles.welcomeText1}>
            Ahórrate problemas,{"\n"}
            llama a un mecánico en{"\n"}
            <Text style={{color: colors.primary[200]}}>Fin-d-Mechs</Text>
          </Text>

          <Text style={[styles.subtitleText, {paddingBottom: 64}]}>
            Agendamientos a domicilio o en taller,{"\n"}
            dependiendo de sus necesidades.
          </Text>

          <CustomButton
            title="Continuar con Email"
            handlePress={() => router.push("/sign-in")}
            buttonStyles={styles.mainButton}
          />
        </View>
      </ScrollView>
      {loading && <ActivityIndicator
        animating={loading}
        color="#fff"
        size={Platform.OS === "ios" ? "large" : 50}
        style={styles.loader}
      />}
      <StatusBar backgroundColor={colors.secondary} style="light" />
    </SafeAreaView>
  );
};
