import { SplashScreen, Stack } from "expo-router";
import "react-native-url-polyfill/auto";

import GlobalProvider from "../api/GlobalProvider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  SplashScreen.hideAsync();

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="editAppointment" options={{ headerShown: false }} />
        <Stack.Screen name="createCar" options={{ headerShown: false }} />
        <Stack.Screen name="editCar" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;