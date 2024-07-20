import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native'
import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useLocalSearchParams } from "expo-router";

import { updateAppointment, cancelAppointment, confirmAppointment, completeAppointment } from "../lib/appwrite";
import { CustomButton, FormField } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const EditAppointment = ({route}) => {
  const { user } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    user: params.user,
    date: params.date,
    city: params.city,
    address: params.address,
    car_make: params.car_make,
    car_model: params.car_model,
    description: params.description,
    service: params.service,
    workshop_id: params.workshop_id,
    mech: params.mech
  });

  const submit = async () => {
    if (form.date === "" ||
      form.city === "" ||
      form.address === "" ||
      form.car_make === "" ||
      form.car_model === "" ||
      form.description === "" ||
      (form.service && form.workshop_id == null) ||
      form.mech === "" ) {
      Alert.alert("Error", "Por favor llene todos los campos");
    }

    setSubmitting(true);
    try {
      await updateAppointment(form);
      Alert.alert("Éxito", "Agendamiento actualizado exitosamente");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = async () => {
    setSubmitting(true);
    try {
      await cancelAppointment(params.id);
      Alert.alert("Éxito", "Agendamiento cancelado exitosamente");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirm = async () => {
    setSubmitting(true);
    try {
      await confirmAppointment(params.id);
      Alert.alert("Éxito", "Agendamiento confirmado exitosamente");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const complete = async () => {
    setSubmitting(true);
    try {
      await completeAppointment(params.id);
      Alert.alert("Éxito", "Agendamiento marcado como completado");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  //Picker de fechas y hora
  const [date, setDate] = useState(new Date(1598051730000));
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
  const [dropdownValue, setDropdownValuealue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  if (user.mech)
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text className="text-2xl text-white mt-10">
              Detalles de cita con mecánico
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.user}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.date}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.city}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.address}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.car_make}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.car_model}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.description}
            </Text>
            { form.service === "null" && <Text className="text-2xl text-white mt-10">Cliente lleva a taller</Text>}
            { form.service === "true" && <Text className="text-2xl text-white mt-10">Atención a domicilio</Text>}
            { form.service === "false" && <Text className="text-2xl text-white mt-10">Mecánico lleva a taller</Text>}
            { form.workshop_id &&
              <Text className="text-2xl text-white mt-10">
                {form.workshop_id}
              </Text>
            }
            <Text className="text-2xl text-white mt-10">
              {form.mech}
            </Text>

            { params.confirmed == "false" &&
              <CustomButton
                title="Confirmar"
                handlePress={confirm}
                containerStyles="mt-7"
                isLoading={isSubmitting}
              />
            }
          </View>
        </ScrollView>
      </SafeAreaView>
  )
  else if (params.confirmed == "true")
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text className="text-2xl text-white mt-10">
              Detalles de cita con mecánico
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.user}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.date}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.city}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.address}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.car_make}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.car_model}
            </Text>
            <Text className="text-2xl text-white mt-10">
              {form.description}
            </Text>
            { form.service === "null" && <Text className="text-2xl text-white mt-10">Cliente lleva a taller</Text>}
            { form.service === "true" && <Text className="text-2xl text-white mt-10">Atención a domicilio</Text>}
            { form.service === "false" && <Text className="text-2xl text-white mt-10">Mecánico lleva a taller</Text>}
            { form.workshop_id &&
              <Text className="text-2xl text-white mt-10">
                {form.workshop_id}
              </Text>
            }
            <Text className="text-2xl text-white mt-10">
              {form.mech}
            </Text>

            <CustomButton
              title="Cancelar"
              handlePress={cancel}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Marcar como completado"
              handlePress={complete}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  else
    return (
      <SafeAreaView className="bg-primary h-full">
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text className="text-2xl text-white mt-10">
              Editar cita con mecánico
            </Text>

            <FormField
              title="Correo de usuario"
              value={form.user}
              readOnly={true}
              otherStyles="mt-7"
              keyboardType="email-address"
            />

            <FormField
              title="Fecha, hora"
              value={form.date}
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
              value={form.city}
              handleChangeText={(e) => setForm({ ...form, city: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Dirección"
              value={form.address}
              handleChangeText={(e) => setForm({ ...form, address: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Marca de vehículo"
              value={form.car_make}
              handleChangeText={(e) => setForm({ ...form, car_make: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Modelo de vehículo"
              value={form.car_model}
              handleChangeText={(e) => setForm({ ...form, car_model: e })}
              otherStyles="mt-7"
            />

            <FormField
              title="Descripción del agendamiento"
              value={form.description}
              handleChangeText={(e) => setForm({ ...form, description: e })}
              otherStyles="mt-7"
            />

            <View className={`space-y-2 mt-7`}>
              <Text className="text-base text-gray-100 font-medium">Tipo de servicio</Text>

              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex">
                <Dropdown
                  className="flex-1 text-white font-semibold text-base"
                  data={[ { label: "Cliente lleva a taller", value: 0 }, { label: "Atención a domicilio", value: 1 }, { label: "Mecánico lleva a taller", value: 2 }]}
                  labelField="label"
                  selectedTextStyle={{ color: 'white' }}
                  valueField="value"
                  value={dropdownValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  placeholder={!isFocus ? 'Select item' : '...'}
                  onChange={(e) => {
                    setDropdownValuealue(e.value);
                    if (dropdownValue == 0)
                      setForm({ ...form, service: true });
                    else if (dropdownValue == 1)
                      setForm({ ...form, service: null });
                    else if (dropdownValue == 2)
                      setForm({ ...form, service: false });
                    setIsFocus(false);
                  }}
                />
              </View>
            </View>

            { dropdownValue == 0 && <FormField
              title="Taller"
              value={form.workshop_id}
              handleChangeText={(e) => setForm({ ...form, workshop_id: e })}
              otherStyles="mt-7"
            />}

            <FormField
              title="Mecánico"
              value={form.mech}
              handleChangeText={(e) => setForm({ ...form, mech: e })}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Actualizar"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EditAppointment