import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, Platform } from "react-native";

import { colors, icons, styles } from "../../constants";
import { useGlobalContext } from "../../api/GlobalProvider";

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarLabelPosition: "below-icon",
          tabBarLabelStyle: {
            fontSize: 16,
            paddingTop: 8
          },
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.gray,
          tabBarItemStyle: {
            height: 80,
            paddingTop: 10
          },
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: colors.secondary,
            borderTopWidth: 1,
            height: 84
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Inicio",
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={icons.home}
                resizeMode="contain"
                tintColor={color}
                style={{height: 40}}
              />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={icons.profile}
                resizeMode="contain"
                tintColor={color}
                style={{height: 40}}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Crear",
            headerShown: false,
            tabBarIcon: ({color}) => (
              <Image
                source={icons.plus}
                resizeMode="contain"
                tintColor={color}
                style={{height: 40}}
              />
            ),
          }}
        />
      </Tabs>

      {loading && <ActivityIndicator
        animating={loading}
        color="#fff"
        size={Platform.OS === "ios" ? "large" : 50}
        style={styles.loader}
      />}
      <StatusBar backgroundColor={colors.secondary} style="light" />
    </>
  );
};

export default TabLayout;