import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../components";
import { getFormData, modifyAppointment, updateAppointment } from "../api/apiAppointments";
import { useGlobalContext } from "../api/GlobalProvider";
import { styles } from "../constants";

const EditAppointment = ({ route }) => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    id: params.id,
    usuario: user?.id,
    fecha: `${params.fecha.split('.')[0].split('T')[0]} ${params.fecha.split('.')[0].split('T')[1]}`,
    ciudad: params.ciudad,
    direccion: params.direccion,
    auto_marca: params.auto_marca,
    auto_modelo: params.auto_modelo,
    detalles: params.detalles,
    mech: params.mech || null,
    servicio: params.servicio,
    id_taller: params.id_taller || null
  });

  const submit = async () => {
    if (form.fecha === "Ingrese una fecha" ||
      form.ciudad === "" ||
      form.direccion === "" ||
      form.auto_marca === "" ||
      form.auto_modelo === "" ||
      form.detalles === "" ||
      (form.servicio === "01" && form.id_taller == null)) {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await modifyAppointment(form);
        if (result)
          router.back();
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const cancel = async () => {
    setSubmitting(true);
    try {
      await updateAppointment(params.id, 1);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const confirm = async () => {
    setSubmitting(true);
    try {
      await updateAppointment(params.id, 2);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const complete = async () => {
    setSubmitting(true);
    try {
      await updateAppointment(params.id, 5);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  //Picker de fechas y hora
  const [date, setDate] = useState(new Date(form.fecha));
  const [mode, setPickerMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);
  const onChangePicker = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowPicker(false);
    setForm({ ...form, fecha: currentDate.toLocaleString() })
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
  const [dropdownValue, setDropdownValue] = useState(params.servicio);
  const [isFocus, setIsFocus] = useState(false);

  //Dropdown de mech
  const [dropdownMech, setDropdownMech] = useState(0);
  const [isMechFocus, setIsMechFocus] = useState(false);
  const [mechList, setMechList] = useState([{id: 0, usuario: "Primero que acepte.", correo: ""}]);
  async function fetchFormData() {
    setLoading(true);
    const result = await getFormData();
    setMechList(mechList.concat(result))
    setLoading(false);
  }
  useEffect(() => {
    fetchFormData()
  }, []);

  if (user.mech)
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text style={styles.titleText}>
              Detalles de cita con mecánico
            </Text>
            <Text style={styles.subtitleText}>
              {user?.correo}
            </Text>
            <Text style={styles.subtitleText}>
              {form.fecha}
            </Text>
            <Text style={styles.subtitleText}>
              {form.ciudad}
            </Text>
            <Text style={styles.subtitleText}>
              {form.direccion}
            </Text>
            <Text style={styles.subtitleText}>
              {form.auto_marca}
            </Text>
            <Text style={styles.subtitleText}>
              {form.auto_modelo}
            </Text>
            <Text style={styles.subtitleText}>
              {form.detalles}
            </Text>
            {form.servicio === "01" && <Text style={styles.subtitleText}>Cliente lleva a taller</Text>}
            {form.servicio === "00" && <Text style={styles.subtitleText}>Atención a domicilio</Text>}
            {form.servicio === "10" && <Text style={styles.subtitleText}>Mecánico lleva a taller</Text>}
            {form.id_taller &&
              <Text style={styles.subtitleText}>
                {form.id_taller}
              </Text>
            }
            <Text style={styles.subtitleText}>
              {form.mech}
            </Text>

            {params.confirmed == "false" &&
              <CustomButton
                title="Confirmar"
                handlePress={confirm}
                isLoading={isSubmitting}
              />
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  else if (params.confirmed == "true")
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text style={styles.titleText}>
              Detalles de cita con mecánico
            </Text>
            <Text style={styles.subtitleText}>
              {user?.correo}
            </Text>
            <Text style={styles.subtitleText}>
              {form.fecha}
            </Text>
            <Text style={styles.subtitleText}>
              {form.ciudad}
            </Text>
            <Text style={styles.subtitleText}>
              {form.direccion}
            </Text>
            <Text style={styles.subtitleText}>
              {form.auto_marca}
            </Text>
            <Text style={styles.subtitleText}>
              {form.auto_modelo}
            </Text>
            <Text style={styles.subtitleText}>
              {form.detalles}
            </Text>
            {form.servicio === "01" && <Text style={styles.subtitleText}>Cliente lleva a taller</Text>}
            {form.servicio === "00" && <Text style={styles.subtitleText}>Atención a domicilio</Text>}
            {form.servicio === "10" && <Text style={styles.subtitleText}>Mecánico lleva a taller</Text>}
            {form.id_taller &&
              <Text style={styles.subtitleText}>
                {form.id_taller}
              </Text>
            }
            <Text style={styles.subtitleText}>
              {form.mech}
            </Text>

            <CustomButton
              title="Cancelar"
              handlePress={cancel}
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Marcar como completado"
              handlePress={complete}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  else
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View
            className="w-full flex justify-center px-4 my-2"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <Text style={styles.subtitleText}>
              Editar cita con mecánico
            </Text>

            <FormField
              title="Correo de usuario"
              value={user?.correo}
              readOnly={true}
              keyboardType="email-address"
            />

            <FormField
              title="Fecha, hora"
              value={form.fecha}
              readOnly={true}
              onPress={showDatepicker}
            />
            <View style={{flexDirection:'row', justifyContent: "space-between", paddingHorizontal: 16}}>
              <CustomButton
                title="Cambiar fecha"
                handlePress={showDatepicker}
                containerStyles={{paddingHorizontal: 32}}
              />
              <CustomButton
                title="Cambiar Hora"
                handlePress={showTimepicker}
                containerStyles={{paddingHorizontal: 32}}
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
            />

            <FormField
              title="Dirección"
              value={form.direccion}
              handleChangeText={(e) => setForm({ ...form, direccion: e })}
            />

            <FormField
              title="Marca de vehículo"
              value={form.auto_marca}
              handleChangeText={(e) => setForm({ ...form, auto_marca: e })}
            />

            <FormField
              title="Modelo de vehículo"
              value={form.auto_modelo}
              handleChangeText={(e) => setForm({ ...form, auto_modelo: e })}
            />

            <FormField
              title="Descripción del agendamiento"
              value={form.detalles}
              handleChangeText={(e) => setForm({ ...form, detalles: e })}
            />

            <View>
              <Text style={styles.subtitleText}>Tipo de servicio</Text>
              <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
                <Dropdown
                  data={[ { label: "Cliente lleva a taller", value: "01" }, { label: "Servicio a domicilio", value: "00" }, { label: "Mecánico lleva a taller", value: "10" }]}
                  labelField="label"
                  placeholderStyle={styles.formField}
                  selectedTextStyle={styles.formField}
                  valueField="value"
                  value={dropdownValue}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  placeholder={!isFocus ? 'Seleccionar item' : '...'}
                  onChange={(e) => {
                    setDropdownValue(e.value);
                    if (e.value != "01")
                      setForm({ ...form, id_taller: null });
                    setForm({ ...form, servicio: e.value });
                    setIsFocus(false);
                  }}
                />
              </View>
            </View>

            {dropdownValue === "01" && <FormField
              title="Taller"
              value={form.id_taller}
              handleChangeText={(e) => setForm({ ...form, id_taller: e })}
            />}

            <View style={{paddingBottom: 50}}>
              <Text style={styles.subtitleText}>Mecánico</Text>
              <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
                <Dropdown
                  data={mechList}
                  labelField="usuario"
                  placeholderStyle={styles.formField}
                  selectedTextStyle={styles.formField}
                  valueField="id"
                  value={dropdownMech}
                  onFocus={() => setIsMechFocus(true)}
                  onBlur={() => setIsMechFocus(false)}
                  placeholder={!isMechFocus ? 'Seleccionar item' : '...'}
                  onChange={(e) => {
                    setDropdownMech(e.id);
                    if (e.id === 0)
                      setForm({ ...form, mech: null });
                    else
                      setForm({ ...form, mech: e.id });
                    setIsMechFocus(false);
                  }}
                />
              </View>
            </View>

            <CustomButton
              title="Actualizar"
              handlePress={submit}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
}

export default EditAppointment