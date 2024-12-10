import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

import { CustomButton, FormField } from "../components";
import { icons, styles } from "../constants";
import { createAppointment, getFormData } from "../api/apiAppointments";
import { useGlobalContext } from "../api/GlobalProvider";

export default () => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const defaultForm = {
    id_usuario: user?.id,
    fecha: "Ingrese una fecha",
    ciudad: user?.ciudad || "Seleccionar item",
    direccion: user?.direccion || "",
    id_auto: null,
    detalles: "",
    id_mech: null,
    servicio: "00",
    id_taller: null
  };
  const [form, setForm] = useState(defaultForm);

  const submit = async () => {
    try {
      if (form.fecha === "Ingrese una fecha" ||
        form.ciudad === "Seleccionar item" ||
        form.direccion === "" ||
        !form.id_auto ||
        form.detalles === "" ||
        (form.servicio === "01" && form.id_taller == null))
        throw new Error("Por favor llene todos los campos.");
      setSubmitting(true);
      await createAppointment(form).then(response => {
        if (response) {
          router.replace("/home");
          setForm(defaultForm);
        }
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  //Picker de fechas y hora
  const [date, setDate] = useState(new Date(new Date().valueOf() + 604800000));
  const [mode, setPickerMode] = useState("date");
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
    showMode("date");
  };
  const showTimepicker = () => {
    showMode("time");
  };

  //Dropdown de ciudades
  const [dropdownCities, setDropdownCities] = useState(form.ciudad);
  const [isCitiesFocus, setIsCitiesFocus] = useState(false);
  const [citiesList, setCitiesList] = useState([]);

  //Dropdown de servicio
  const [dropdownService, setDropdownService] = useState("00");
  const [isServiceFocus, setIsServiceFocus] = useState(false);
  const [serviceList, setServiceList] = useState([{ label: "Servicio a domicilio", value: "00" }]);

  //Dropdown de autos
  const [dropdownCars, setDropdownCars] = useState(0);
  const [isCarsFocus, setIsCarsFocus] = useState(false);
  const [carsList, setCarsList] = useState([]);

  //Dropdown de mech
  const [dropdownMech, setDropdownMech] = useState(0);
  const [isMechFocus, setIsMechFocus] = useState(false);
  const [mechList, setMechList] = useState([{id: 0, usuario: "", correo: "Primero que acepte."}]);

  //Dropdown de talleres
  const [dropdownWorkshop, setDropdownWorkshop] = useState(0);
  const [isWorkshopFocus, setIsWorkshopFocus] = useState(false);
  const [workshopList, setWorkshopList] = useState([]);

  async function fetchFormData() {
    try {
      setLoading(true);
      await getFormData().then(response => {
        if (response) {
          setCitiesList(response.cities);
          setCarsList(response.cars);
          if (response.cars.length > 0) {
            setDropdownCars(response.cars[0].id);
            setForm({...form, id_auto: response.cars[0].id});
          } else {
            router.back();
            throw new Error("Para agendar una cita, primero debe registrar un auto en su perfil. Solo se permite una cita por auto.");
          }
          if (response.mechs.length > 0)
            setMechList(mechList.concat(response.mechs));
          setWorkshopList(response.workshops);
          if (response.workshops.length > 0 || true) //TODO: remove true
            setServiceList([{ label: "Servicio a domicilio", value: "00" }, { label: "Mecánico lleva a taller", value: "10" }, { label: "Cliente lleva a taller", value: "01" }])
        }
      });
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{flexDirection: "row", justifyContent: "flex-start", paddingLeft: 8, paddingTop: 8, position: "absolute", zIndex: 1}}
          >
            <Image
              source={icons.leftArrow}
              resizeMode="contain"
              style={{height: 40, width: 40}}
            />
          </TouchableOpacity>

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
          <View style={{flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 8}}>
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

          <View style={{paddingBottom: 8}}>
            <Text style={styles.subtitleText}>Comuna</Text>
            <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
              <Dropdown
                data={citiesList}
                labelField="label"
                placeholderStyle={styles.formField}
                selectedTextStyle={styles.formField}
                valueField="label"
                value={dropdownCities}
                onFocus={() => setIsCitiesFocus(true)}
                onBlur={() => setIsCitiesFocus(false)}
                placeholder={!isCitiesFocus ? "Seleccionar item" : "..."}
                onChange={(e) => {
                  setDropdownCities(e.label);
                  setForm({ ...form, ciudad: e.label });
                  setIsCitiesFocus(false);
                }}
              />
            </View>
          </View>

          <FormField
            title="Dirección"
            value={form.direccion}
            handleChangeText={(e) => setForm({ ...form, direccion: e })}
            maxLength={64}
          />

          <View style={{paddingBottom: 8}}>
            <Text style={styles.subtitleText}>Vehículo</Text>
            <View style={{alignSelf: "center", width: Dimensions.get("window").width-50}}>
              <Dropdown
                data={carsList}
                labelField="modelo"
                placeholderStyle={styles.formField}
                selectedTextStyle={styles.formField}
                valueField="id"
                value={dropdownCars}
                onFocus={() => setIsCarsFocus(true)}
                onBlur={() => setIsCarsFocus(false)}
                placeholder={!isCarsFocus ? "Seleccionar item" : "..."}
                onChange={(e) => {
                  setDropdownCars(e.id);
                  setForm({ ...form, id_auto: e.id });
                  setIsCarsFocus(false);
                }}
              />
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
                placeholder={!isServiceFocus ? "Seleccionar item" : "..."}
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
                  placeholder={!isWorkshopFocus ? "Seleccionar item" : "..."}
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
                  labelField="correo"
                  placeholderStyle={styles.formField}
                  selectedTextStyle={styles.formField}
                  valueField="id"
                  value={dropdownMech}
                  onFocus={() => setIsMechFocus(true)}
                  onBlur={() => setIsMechFocus(false)}
                  placeholder={!isMechFocus ? "Seleccionar item" : "..."}
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

          <CustomButton
            title="Agendar"
            handlePress={submit}
            containerStyles={{paddingBottom: 40, paddingTop: 16}}
            buttonStyles={styles.mainButton}
            isLoading={isSubmitting}
          />
      </ScrollView>
    </SafeAreaView>
  )
};
