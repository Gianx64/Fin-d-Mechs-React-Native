import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../../components";
import { createAppointment } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";

const CreateAppointment = () => {
  const { user } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    usuario: user?.id,
    fecha: "Ingrese una fecha",
    ciudad: "",
    direccion: "",
    auto_marca: "",
    auto_modelo: "",
    detalles: "",
    servicio: "01",
    id_taller: null,
    mech: ""
  });

  const submit = async () => {
    if (form.servicio != "01")
      setForm({ ...form, id_taller: null });
    console.log("Submitting form:", JSON.stringify(form));
    if (form.fecha === "Ingrese una fecha" ||
      form.ciudad === "" ||
      form.direccion === "" ||
      form.auto_marca === "" ||
      form.auto_modelo === "" ||
      form.detalles === "" ||
      (form.servicio === "01" && form.id_taller == null) ||
      form.mech === "" ) {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        await createAppointment(form);
        router.replace("/home");
      } catch (error) {
        Alert.alert("Error de cliente", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };
  
  //Picker de fechas y hora
  const [date, setDate] = useState(new Date());
  const [mode, setPickerMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);
  const onChangePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPicker(false);
    setForm({ ...form, date: currentDate.toLocaleString() })
    setDate(currentDate);
  };
  const showMode = (currentMode) => {
    setShowPicker(true);
    setPickerMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };

  //Dropdown de servicio
  const [dropdownValue, setDropdownValue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <SafeAreaView className="bg-primary">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-2"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Text className="text-2xl text-white mt-10">
            Crear cita con mecánico
          </Text>

          <FormField
            title="Correo de usuario"
            value={user?.correo}
            editable={false}
            readOnly={true}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Fecha, hora"
            value={form.fecha}
            readOnly={true}
            onPress={showDatepicker}
            otherStyles="mt-7"
          />
          <View className="mt-2 flex-row">
            <CustomButton
              title="Cambiar fecha"
              handlePress={showDatepicker}
              containerStyles="w-1/2"
            />
            <CustomButton
              title="Cambiar Hora"
              handlePress={showTimepicker}
              containerStyles="w-1/2"
            />
          </View>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChangePicker}
            />
          )}

          <FormField
            title="Ciudad"
            value={form.ciudad}
            handleChangeText={(e) => setForm({ ...form, ciudad: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Dirección"
            value={form.direccion}
            handleChangeText={(e) => setForm({ ...form, direccion: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Marca de vehículo"
            value={form.auto_marca}
            handleChangeText={(e) => setForm({ ...form, auto_marca: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Modelo de vehículo"
            value={form.auto_modelo}
            handleChangeText={(e) => setForm({ ...form, auto_modelo: e })}
            otherStyles="mt-7"
          />

          <FormField
            title="Descripción del agendamiento"
            value={form.detalles}
            handleChangeText={(e) => setForm({ ...form, detalles: e })}
            otherStyles="mt-7"
          />

          <View className={`space-y-2 mt-7`}>
            <Text className="text-base text-gray-100 font-medium">Tipo de servicio</Text>

            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex">
              <Dropdown
                className="flex-1 text-white font-semibold text-base"
                data={[ { label: "Cliente lleva a taller", value: "01" }, { label: "Servicio a domicilio", value: "00" }, { label: "Mecánico lleva a taller", value: "10" }]}
                labelField="label"
                selectedTextStyle={{ color: 'white' }}
                valueField="value"
                value={dropdownValue}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                placeholder={!isFocus ? 'Seleccionar item' : '...'}
                onChange={(e) => {
                  setDropdownValue(e.value);
                  setForm({ ...form, servicio: e.value });
                  setIsFocus(false);
                }}
              />
            </View>
          </View>

          { dropdownValue === "01" && <FormField
            title="Taller"
            value={form.id_taller}
            handleChangeText={(e) => setForm({ ...form, id_taller: e })}
            otherStyles="mt-7"
          />}

          <FormField
            title="Mecánico"
            value={form.mech}
            handleChangeText={(e) => setForm({ ...form, mech: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Agendar"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateAppointment