import { SplashScreen, Stack } from "expo-router";
import "react-native-url-polyfill/auto";
import GlobalProvider from "./GlobalProvider";

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
        <Stack.Screen name="administration" options={{ headerShown: false }} />
        <Stack.Screen name="appointmentCreate" options={{ headerShown: false }} />
        <Stack.Screen name="appointmentEdit" options={{ headerShown: false }} />
        <Stack.Screen name="carCreate" options={{ headerShown: false }} />
        <Stack.Screen name="carEdit" options={{ headerShown: false }} />
        <Stack.Screen name="mechReview" options={{ headerShown: false }} />
        <Stack.Screen name="userEdit" options={{ headerShown: false }} />
        <Stack.Screen name="workshopCreate" options={{ headerShown: false }} />
        <Stack.Screen name="workshopScreen" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
};

export default RootLayout;