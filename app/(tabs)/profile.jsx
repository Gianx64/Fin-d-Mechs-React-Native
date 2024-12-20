import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../GlobalProvider";
import { getCars } from "../../api/apiCars";
import { getMechWorkshops } from "../../api/apiWorkshops";
import { signOut } from "../../api/apiUsers";
import { icons, styles } from "../../constants";
import { CarsComponent, CustomButton, WorkshopsComponent } from "../../components";

export default () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [list, setList] = useState([]);

  const logout = async () => {
    await signOut().then(() => {
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    });
  };

  async function fetchCarData() {
    await getCars().then(response => {
      if (response)
        setList(response);
    });
  }
  async function fetchWorkshopData() {
    await getMechWorkshops().then(response => {
      if (response)
        setList(response);
    });
  }
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      const refresh = setTimeout(() => {
        if (user?.rol === "11" || user?.rol === "00")
          fetchCarData();
        if (user?.rol === "10")
          fetchWorkshopData();
        setRefreshing(false);
      }, 1000);
      return () => {
        clearTimeout(refresh);
        setRefreshing(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={[styles.titleText, {height: 150, textAlign: "flex-start"}]}>
            Rol: {user?.rol === "11" ? "Administrador" : user?.rol === "10" ? "Mech verificado" : user?.rol === "01" ? "Mech no verificado" : "Usuario"}{"\n"}
            Celular: {user?.celular}{"\n"}
            Nombre: {user?.nombre}{"\n"}
            Correo: {user?.correo}{"\n"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Cerrar sesión",
                "¿Cerrar sesión y volver a la página principal?",
                [
                  { text: "Volver", style: "cancel" },
                  { text: "OK", onPress: () => logout() }
                ],
                { cancelable: true }
              )
            }
            style={{paddingVertical: 16}}
          >
            <Image
              source={icons.logout}
              resizeMode="contain"
              style={{height: 50, width: 50}}
            />
          </TouchableOpacity>
        </View>
        <View style={{alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between"}}>
          <CustomButton
            title={"Editar perfil"}
            buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
            handlePress={() => {
              router.push("/userEdit");
            }}
          />
          { user?.rol === "11" &&
            <CustomButton
              title={"Administración"}
              buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
              handlePress={() => {
                router.push("/administration");
              }}
            />
          }
        </View>
        {(user?.rol === "11" || user?.rol === "00") &&
          <CarsComponent
            refreshing={refreshing}
            list={list}
            fetchData={fetchCarData}
          />
        }
        { user?.rol === "10" &&
          <WorkshopsComponent
            refreshing={refreshing}
            list={list}
            fetchData={fetchWorkshopData}
          />
        }
      </View>
    </SafeAreaView>
  );
};
