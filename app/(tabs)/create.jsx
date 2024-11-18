import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../../components";
import { createAppointment, getFormData } from "../../api/apiAppointments";
import { useGlobalContext } from "../../api/GlobalProvider";
import { styles } from "../../constants";

const CreateAppointment = () => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id_usuario: user?.id,
    fecha: "Ingrese una fecha",
    ciudad: "",
    direccion: "",
    auto_marca: "",
    auto_modelo: "",
    detalles: "",
    id_mech: null,
    servicio: "01",
    id_taller: null
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
        const result = await createAppointment(form);
        if (result) {
          router.replace("/home");
          setForm({
            usuario: user?.id,
            fecha: "Ingrese una fecha",
            ciudad: "",
            direccion: "",
            auto_marca: "",
            auto_modelo: "",
            detalles: "",
            mech: null,
            servicio: "01",
            id_taller: null
          });
        }
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
  const [dropdownValue, setDropdownValue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);

  //Dropdown de mech
  const [dropdownMech, setDropdownMech] = useState(0);
  const [isMechFocus, setIsMechFocus] = useState(false);
  const [mechList, setMechList] = useState([{id: 0, usuario: "Primero que acepte.", correo: ""}]);
  async function fetchFormData() {
    setLoading(true);
    try {
      const response = await getFormData();
      if (response)
        setMechList(mechList.concat(response));
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchFormData()
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{padding: 10}}>
          <Text style={styles.titleText}>
            Crear cita con mecánico
          </Text>

          <FormField
            title="Correo de usuario"
            value={user?.correo}
            editable={false}
            readOnly={true}
            keyboardType="email-address"
          />

          <FormField
            title="Fecha, hora"
            value={form.fecha}
            readOnly={true}
            onPress={showDatepicker}
          />
          <View style={{flexDirection:'row', justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8}}>
            <CustomButton
              title="Cambiar fecha"
              handlePress={showDatepicker}
              buttonStyles={{paddingHorizontal: 32}}
            />
            <CustomButton
              title="Cambiar Hora"
              handlePress={showTimepicker}
              buttonStyles={{paddingHorizontal: 32}}
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
            maxLength={32}
          />

          <FormField
            title="Dirección"
            value={form.direccion}
            handleChangeText={(e) => setForm({ ...form, direccion: e })}
            maxLength={64}
          />

          <FormField
            title="Marca de vehículo"
            value={form.auto_marca}
            handleChangeText={(e) => setForm({ ...form, auto_marca: e })}
            maxLength={16}
          />

          <FormField
            title="Modelo de vehículo"
            value={form.auto_modelo}
            handleChangeText={(e) => setForm({ ...form, auto_modelo: e })}
            maxLength={32}
          />

          <FormField
            title="Descripción del agendamiento"
            value={form.detalles}
            handleChangeText={(e) => setForm({ ...form, detalles: e })}
            maxLength={128}
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

          { dropdownValue === "01" && dropdownMech != 0 && <FormField
            title="Taller"
            value={form.id_taller}
            handleChangeText={(e) => setForm({ ...form, id_taller: e })}
          />}

          <View style={{paddingBottom: 20}}>
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
                  console.log(JSON.stringify(mechList));
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
            title="Agendar"
            handlePress={submit}
            isLoading={isSubmitting}
            containerStyles={{paddingBottom: 40}}
          />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateAppointment