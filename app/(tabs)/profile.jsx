import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, FlatList, TouchableOpacity, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, styles } from "../../constants";
import { getCars } from "../../api/apiCars";
import { signOut } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";
import CustomButton from "../../components/CustomButton";

export default () => {
  const { user, setUser, setIsLogged, setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [carList, setCarList] = useState([]);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  async function fetchCarData() {
    setLoading(true);
    try {
      const response = await getCars();
      if (response)
        setCarList(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const handleRefresh = async () => {
    if (user?.rol === "11" || user?.rol === "00") {
      setRefreshing(true);
      await fetchCarData();
      setRefreshing(false);
    }
  }
  useEffect(() => {
    if (user?.rol === "11" || user?.rol === "00")
      fetchCarData()
  }, []);

  switch (user?.rol) {
    case "11":
    case "00":
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
                  Rol: {user?.rol === "11" ? "Administrador" : "Usuario"}
                </Text>
              </View>
              <View>
                <TouchableOpacity
                  onPress={logout}
                  style={{flexDirection:'row', justifyContent: "flex-end", paddingRight: 8, paddingTop: 8}}
                >
                  <Image
                    source={icons.logout}
                    resizeMode="contain"
                    style={{height: 50, width: 50}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{alignItems: "flex-end"}}>
              <CustomButton
                title={"Registrar auto"}
                buttonStyles={[styles.normalButton, {paddingVertical: 8, paddingHorizontal: 16}]}
                handlePress={() => {
                  router.push("/carCreate");
                }}
              />
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
                onRefresh={handleRefresh}
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
                  <Text style={[styles.normalText, {flex: 1}]}>¡Registre su auto para pedir una cita!</Text>
                }
              />
            </View>
          </View>
        </SafeAreaView>
      );
    case "10":
    case "01":
      return (
        <SafeAreaView style={styles.container}>
          <View style={{padding: 10}}>
            <View>
              <View style={{flexDirection:'row', justifyContent: "flex-end", padding: 16}}>
                <TouchableOpacity onPress={logout} >
                  <Image
                    source={icons.logout}
                    resizeMode="contain"
                    style={{height: 50, width: 50}}
                  />
                </TouchableOpacity>
              </View>
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
                Rol: {user?.rol === "10" ? "Mech verificado": "Mech no verificado"}
              </Text>
            </View>
            <View></View>
          </View>
        </SafeAreaView>
      );
    }
};
