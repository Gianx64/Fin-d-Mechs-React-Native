import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, styles } from "../../constants";
import { getCars } from "../../api/apiCars";
import { signOut } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";
import CustomButton from "../../components/CustomButton";

export default () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [carList, setCarList] = useState([]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  async function fetchCarData() {
    setRefreshing(true);
    if (user?.rol === "11" || user?.rol === "00")
      await getCars().then(response => {
        if (response)
          setCarList(response);
        setRefreshing(false);
      });
  }
  useFocusEffect(
    useCallback(() => {
      fetchCarData()
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <View style={{flexDirection: "row", justifyContent: "space-between", padding: 2}}>
          <View>
            <Text style={[styles.titleText, {paddingVertical: 8, textAlign: "flex-start"}]}>
              Nombre: {user?.nombre}
            </Text>
            <Text style={[styles.titleText, {paddingVertical: 8, textAlign: "flex-start"}]}>
              Celular: {user?.celular}
            </Text>
            <Text style={[styles.titleText, {paddingVertical: 8, textAlign: "flex-start"}]}>
              Correo: {user?.correo}
            </Text>
            <Text style={[styles.titleText, {paddingVertical: 8, textAlign: "flex-start"}]}>
              Rol: {user?.rol === "11" ? "Administrador" : user?.rol === "10" ? "Mech verificado" : user?.rol === "01" ? "Mech no verificado" : "Usuario"}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={logout}
              style={{flexDirection:'row', justifyContent: "flex-end", paddingRight: 8, paddingTop: 8, position: "relative"}}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                style={{height: 50, width: 50}}
              />
            </TouchableOpacity>
          </View>
        </View>
        { (user?.rol === "11" || user?.rol === "00") &&
        <View>
          <View style={{alignItems: "flex-end", flexDirection:'row', justifyContent: "space-between"}}>
            <CustomButton
              title={"Registrar auto"}
              buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
              handlePress={() => {
                router.push("/carCreate");
              }}
            />
            { user?.rol === "11" &&
              <CustomButton
                title={"Panel de administración"}
                buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
                handlePress={() => {
                  router.push("/administration");
                }}
              />
            }
          </View>
          <View>
            {carList.length > 0 &&
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={[styles.normalText]}>Patente</Text>
                <Text style={[styles.normalText]}>Marca</Text>
                <Text style={[styles.normalText]}>Modelo</Text>
                <Text style={[styles.normalText]}>Acción</Text>
              </View>
            }
            <FlatList
              refreshing={refreshing}
              onRefresh={fetchCarData}
              data = {carList}
              keyExtractor={(item) => item.id}
              renderItem={({item}) => (
                <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                  <Text style={[styles.normalText]}>{item.patente}</Text>
                  <Text style={[styles.normalText]}>{item.marca}</Text>
                  <Text style={[styles.normalText]}>{item.modelo}</Text>
                  <CustomButton
                    title={"Editar"}
                    buttonStyles={styles.normalButton}
                    handlePress={() => {
                      router.push({pathname: "/carEdit", params: item});
                    }}
                  />
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.subtitleText}>¡Registre su auto para pedir una cita!</Text>
              }
            />
          </View>
        </View>
        }
      </View>
    </SafeAreaView>
  );
};
