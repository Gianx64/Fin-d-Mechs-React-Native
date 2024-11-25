import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, Alert, TouchableOpacity, Image } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../components";
import { flagAppointment, getFormData, patchAppointment } from "../api/apiAppointments";
import { useGlobalContext } from "../api/GlobalProvider";
import { icons, styles } from "../constants";

export default ({ route }) => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const [form, setForm] = useState({
    id: params.id,
    id_usuario: params.id_usuario,
    fecha: `${params.fecha.split('.')[0].split('T')[0]} ${params.fecha.split('.')[0].split('T')[1]}`,
    ciudad: params.ciudad,
    direccion: params.direccion,
    id_auto: params.id_auto,
    detalles: params.detalles,
    id_mech: params.id_mech || null,
    servicio: params.servicio,
    id_taller: params.id_taller || null
  });

  const submit = async () => {
    if (form.fecha === "Ingrese una fecha" ||
      form.ciudad === "" ||
      form.direccion === "" ||
      !form.id_auto ||
      form.detalles === "" ||
      (form.servicio === "01" && form.id_taller == null)) {
      Alert.alert("Error", "Por favor llene todos los campos");
    } else {
      setSubmitting(true);
      try {
        const result = await patchAppointment(form, 0);
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
    const result = await flagAppointment(params.id, 1);
    if (result) {
      setSubmitting(false);
      router.back();
    }
  };

  const take = async () => {
    setSubmitting(true);
    const result = await flagAppointment(params.id, 2);
    if (result) {
      setSubmitting(false);
      router.back();
    }
  };

  const confirm = async () => {
    setSubmitting(true);
    const result = await flagAppointment(params.id, 3);
    if (result) {
      setSubmitting(false);
      router.back();
    }
  };

  const complete = async () => {
    setSubmitting(true);
    const result = await flagAppointment(params.id, 6);
    if (result) {
      setSubmitting(false);
      router.back();
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
  const [dropdownService, setDropdownService] = useState("00");
  const [isServiceFocus, setIsServiceFocus] = useState(false);
  const [serviceList, setServiceList] = useState([{ label: "Servicio a domicilio", value: "00" }, { label: "Mecánico lleva a taller", value: "10" }]);

  //Dropdown de autos
  const [dropdownCars, setDropdownCars] = useState(0);
  const [isCarsFocus, setIsCarsFocus] = useState(false);
  const [carsList, setCarsList] = useState([]);

  //Dropdown de mech
  const [dropdownMech, setDropdownMech] = useState(0);
  const [isMechFocus, setIsMechFocus] = useState(false);
  const [mechList, setMechList] = useState([{id: 0, usuario: "Primero que acepte.", correo: ""}]);

  //Dropdown de talleres
  const [dropdownWorkshop, setDropdownWorkshop] = useState(0);
  const [isWorkshopFocus, setIsWorkshopFocus] = useState(false);
  const [workshopList, setWorkshopList] = useState([]);

  async function fetchFormData() {
    setLoading(true);
    try {
      const response = await getFormData();
      if (response) {
        setCarsList(response.cars);
        if (response.cars.length > 0) {
          setDropdownCars(response.cars[0].id);
          setForm({...form, id_auto: response.cars[0].id});
        }
        setMechList(mechList.concat(response.mechs));
        setWorkshopList(response.workshops);
        if (response.workshops.length > 0 || true) //TODO: remove true
          setServiceList([{ label: "Servicio a domicilio", value: "00" }, { label: "Mecánico lleva a taller", value: "10" }, { label: "Cliente lleva a taller", value: "01" }])
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchFormData()
  }, []);

  if (params.cancelado || params.completado)
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{padding: 10}}>
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

          <Text style={[styles.titleText, {paddingHorizontal: 16, textAlign: "right"}]}>
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
            {form.id_mech}
          </Text>

          {params.confirmed == "false" && params.mech_usuario &&
            <CustomButton
              title="Confirmar"
              handlePress={confirm}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
          }
          {params.confirmed == "false" && !params.mech_usuario &&
            <CustomButton
              title="Tomar"
              handlePress={take}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
          }
          {params.confirmed == "true" &&
            <View>
              <CustomButton
                title="Cancelar"
                handlePress={cancel}
                isLoading={isSubmitting}
              />
              <CustomButton
                title="Marcar como completado"
                handlePress={complete}
                buttonStyles={styles.mainButton}
                isLoading={isSubmitting}
              />
            </View>
          }
        </ScrollView>
      </SafeAreaView>
    );
  else
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={{padding: 10}}>
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
  
          <Text style={styles.titleText}>
            Modificar cita con mecánico
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
              buttonStyles={[styles.normalButton, {paddingHorizontal: 32, paddingVertical: 8}]}
            />
            <CustomButton
              title="Cambiar Hora"
              handlePress={showTimepicker}
              buttonStyles={[styles.normalButton, {paddingHorizontal: 32, paddingVertical: 8}]}
            />
          </View>
          { showPicker &&
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChangePicker}
            />
          }
  
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
  
          <View style={{paddingBottom: 8}}>
            <Text style={styles.subtitleText}>Vehículo</Text>
            <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
              <Text style={styles.normalText}>{params.patente} {params.vin} {params.marca} {params.modelo}</Text>
            </View>
          </View>
  
          <FormField
            title="Descripción del agendamiento"
            value={form.detalles}
            handleChangeText={(e) => setForm({ ...form, detalles: e })}
            maxLength={128}
          />
  
          <View style={{paddingBottom: 8}}>
            <Text style={styles.subtitleText}>Tipo de servicio</Text>
            <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
              <Dropdown
                data={serviceList}
                labelField="label"
                placeholderStyle={styles.formField}
                selectedTextStyle={styles.formField}
                valueField="value"
                value={dropdownService}
                onFocus={() => setIsServiceFocus(true)}
                onBlur={() => setIsServiceFocus(false)}
                placeholder={!isServiceFocus ? 'Seleccionar item' : '...'}
                onChange={(e) => {
                  setDropdownService(e.value);
                  if (e.value != "01")
                    setForm({ ...form, id_taller: null });
                  setForm({ ...form, servicio: e.value });
                  setIsServiceFocus(false);
                }}
              />
            </View>
          </View>
  
          { dropdownService === "01" && (workshopList.length > 0 || true) && //TODO: remove true
            <View style={{paddingBottom: 8}}>
              <Text style={styles.subtitleText}>Taller</Text>
              <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
                <Dropdown
                  data={workshopList}
                  labelField="direccion"
                  placeholderStyle={styles.formField}
                  selectedTextStyle={styles.formField}
                  valueField="id"
                  value={dropdownWorkshop}
                  onFocus={() => setIsWorkshopFocus(true)}
                  onBlur={() => setIsWorkshopFocus(false)}
                  placeholder={!isWorkshopFocus ? 'Seleccionar item' : '...'}
                  onChange={(e) => {
                    setDropdownWorkshop(e.id);
                    setForm({ ...form, id_taller: e.id });
                    setIsWorkshopFocus(false);
                  }}
                />
              </View>
            </View>
          }
  
          { dropdownService !== "01" &&
            <View style={{paddingBottom: 8}}>
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
                      setForm({ ...form, id_mech: null });
                    else
                      setForm({ ...form, id_mech: e.id });
                    setIsMechFocus(false);
                  }}
                />
              </View>
            </View>
          }

          <View style={{paddingBottom: 40, paddingTop: 16}}>
            <CustomButton
              title="Cancelar"
              handlePress={cancel}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Actualizar"
              handlePress={submit}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}
