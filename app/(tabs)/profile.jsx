import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, FlatList, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, styles } from "../../constants";
import { getCars } from "../../api/apiCars";
import { secureStoreDelete } from "../../api/apiManager";
import { useGlobalContext } from "../../api/GlobalProvider";

const Profile = () => {
  const { user, setUser, setIsLogged, setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [carList, setCarList] = useState([]);

  const logout = async () => {
    //await signOut();
    await secureStoreDelete("Token");
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };
  async function fetchCarData() {
    setLoading(true);
    try {
      const response = await getCars();
      if (response)
        setCarList(carList.concat(response));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCarData();
    setRefreshing(false);
  }
  useEffect(() => {
    fetchCarData()
  }, []);

  switch (user?.rol) {
    case "11":
    case "00":
      return (
        <SafeAreaView style={styles.container}>
          <View style={{padding: 10}}>
            <FlatList
              ListHeaderComponent={() => (
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
                  <Text style={styles.titleText}>
                    {user?.nombre}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.celular}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.correo}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.rol === "11" ? "Administrador" : "Usuario"}
                  </Text>
                </View>
              )}
            />
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
                  <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={[styles.normalText]}>{item.patente}</Text>
                    <Text style={[styles.normalText]}>{item.marca}</Text>
                    <Text style={[styles.normalText]}>{item.modelo}</Text>
                    <Link
                      style={[styles.normalText]}
                      href={{pathname: "/editCar", params: item}}
                    >
                      Editar
                    </Link>
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
      return (
        <SafeAreaView style={styles.container}>
          <View style={{padding: 10}}>
            <FlatList
              ListHeaderComponent={() => (
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
                  <Text style={styles.titleText}>
                    {user?.nombre}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.celular}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.correo}
                  </Text>
                  <Text style={styles.titleText}>
                    Mech verificado
                  </Text>
                </View>
              )}
            />
            <View></View>
          </View>
        </SafeAreaView>
      );
    case "01":
      return (
        <SafeAreaView style={styles.container}>
          <View style={{padding: 10}}>
            <FlatList
              ListHeaderComponent={() => (
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
                  <Text style={styles.titleText}>
                    {user?.nombre}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.celular}
                  </Text>
                  <Text style={styles.titleText}>
                    {user?.correo}
                  </Text>
                  <Text style={styles.titleText}>
                    Mech no verificado
                  </Text>
                </View>
              )}
            />
            <View></View>
          </View>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={{padding: 10}}>
          <FlatList
            ListHeaderComponent={() => (
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
                <Text style={styles.titleText}>
                  {user?.nombre}
                </Text>
                <Text style={styles.titleText}>
                  {user?.celular}
                </Text>
                <Text style={styles.titleText}>
                  {user?.correo}
                </Text>
                <Text style={styles.titleText}>
                  {user?.rol == "11" ? "Admin" : user?.rol == "10" ? "Mech verificado" : user?.rol == "00" ? "Usuario" : user?.rol == "01" ? "Mech no verificado" : ""}
                </Text>
              </View>
            )}
          />
          <View></View>
        </View>
      </SafeAreaView>
    );
};

export default Profile;