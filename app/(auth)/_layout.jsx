import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Platform } from "react-native";
import { useGlobalContext } from "../GlobalProvider";
import { colors, styles } from "../../constants";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {loading && <ActivityIndicator
        animating={loading}
        color="#fff"
        size={Platform.OS === "android" ? 50 : "large"}
        style={styles.loader}
      />}
      <StatusBar backgroundColor={colors.secondary} style="light" />
    </>
  );
};

export default AuthLayout;