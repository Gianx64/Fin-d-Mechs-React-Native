import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { CheckBox } from "react-native-btr";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton, FormField } from "../../components";
import { images, styles } from "../../constants";
import { createUser } from "../../api/apiUsers";
import { useGlobalContext } from "../../api/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged, loading, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
    mech: false,
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await createUser(form.username, form.phone, form.email, form.password, form.mech);
        if (result) {
          setUser({ usuario: form.username, celular: form.phone, correo: form.email, ...result.data.user});
          setIsLogged(true);
          router.replace("/home");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-2"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            style={styles.tinyLogo}
            resizeMode="contain"
          />

          <Text className="text-2xl text-white mt-10">
            Registrarse en Fin-d-Mechs
          </Text>

          <FormField
            title="Nombre de usuario"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
            maxLength={64}
          />

          <FormField
            title="Celular"
            value={form.phone}
            handleChangeText={(e) => setForm({ ...form, phone: e })}
            otherStyles="mt-7"
            inputmode="tel"
            keyboardType="phone-pad"
            maxLength={16}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e.toLowerCase() })}
            otherStyles="mt-7"
            keyboardType="email-address"
            maxLength={64}
          />

          <FormField
            title="Contraseña"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            maxLength={64}
          />

          <View className="mt-7 flex-row">
            <Text className="text-base text-gray-100 font-medium">¿Eres un mecánico?</Text>
            <View className="ml-8 w-6.5">
              <CheckBox
                checked={form.mech}
                color= {styles.colors.secondary.DEFAULT}
                borderRadius={10}
                borderWidth={5}
                onPress={() => setForm({ ...form, mech: !form.mech })}
              />
            </View>
          </View>

          <CustomButton
            title="Registrarse"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">
              ¿Ya tiene una cuenta?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg text-secondary"
            >
              Iniciar sesión
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
