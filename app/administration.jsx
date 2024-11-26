import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../components";
import { icons, styles } from "../constants";
import { getAdminData } from "../api/apiUsers";
import { useGlobalContext } from "../api/GlobalProvider";

export default ({ route }) => {
  const { setLoading } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(true);
  const [mechsList, setMechsList] = useState([]);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const response = await getAdminData();
      if (response) {
        setMechsList(response.mechs);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminData();
    setRefreshing(false);
  }
  useEffect(() => {
    fetchAdminData()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <TouchableOpacity
          onPress={() => {router.back()}}
          style={{flexDirection:'row', justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
        >
          <Image
            source={icons.leftArrow}
            resizeMode="contain"
            style={{height: 40, width: 40}}
          />
        </TouchableOpacity>

        <Text style={styles.titleText}>Panel de Administrador</Text>

        <View>
          {mechsList.length > 0 &&
            <View style={{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={[styles.normalText]}>Correo</Text>
              <Text style={[styles.normalText]}>Verificado</Text>
              <Text style={[styles.normalText]}>Acción</Text>
            </View>
          }
          <FlatList
            refreshing={refreshing}
            onRefresh={handleRefresh}
            data = {mechsList}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <View style={{alignItems: "center", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={[styles.normalText, {fontSize: 12}]}>{item.correo}</Text>
                <Text style={[styles.normalText]}>{item.verificado ? "Sí" : "No"}</Text>
                <CustomButton
                  title={"Revisar"}
                  buttonStyles={styles.normalButton}
                  handlePress={() => {
                    router.push({pathname: "/mechReview", params: item});
                  }}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text style={[styles.normalText, {flex: 1}]}>¡No quedan mechs para verificar!</Text>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}