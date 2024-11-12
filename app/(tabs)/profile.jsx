import { router } from "expo-router";
import { View, Image, FlatList, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons, styles } from "../../constants";
import { secureStoreDelete } from "../../api/apiManager";
import { useGlobalContext } from "../../api/GlobalProvider";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  const logout = async () => {
    //await signOut();
    await secureStoreDelete("Token");
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;