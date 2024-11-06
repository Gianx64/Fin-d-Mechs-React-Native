import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, Platform, Text, View } from "react-native";

import { colors, icons, styles } from "../../constants";
import { useGlobalContext } from "../../api/GlobalProvider";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{height: 50}}
      />
      <Text
        className={`text-xs`}
        style={{color: color, textAlign: "center"}}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary.DEFAULT,
          tabBarInactiveTintColor: colors.gray,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.secondary,
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Inicio"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Crear"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Perfil"
                focused={focused}
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