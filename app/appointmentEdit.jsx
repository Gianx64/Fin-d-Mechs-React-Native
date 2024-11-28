import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { CustomButton, FormField } from "../components";
import { flagAppointment, getFormData, updateAppointment } from "../api/apiAppointments";
import { useGlobalContext } from "../api/GlobalProvider";
import { icons, styles } from "../constants";

export default () => {
  const { user, setLoading } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [isCancelling, setCancelling] = useState(false);
  const [isConfirming, setConfirming] = useState(false);
  const [isCompleting, setCompleting] = useState(false);
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
    try {
      if (form.fecha === "Ingrese una fecha" ||
        form.ciudad === "" ||
        form.direccion === "" ||
        !form.id_auto ||
        form.detalles === "" ||
        (form.servicio === "01" && form.id_taller == null))
        throw new Error("Por favor llene todos los campos");
      setSubmitting(true);
      await updateAppointment(form, 0).then(response => {
        if (response)
          router.back();
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
        setSubmitting(false);
    }
  };

  const cancel = async () => {
    setCancelling(true);
    await flagAppointment(params.id, 1).then(response => {
      if (response)
        router.back();
      setCancelling(false);
    });
  };

  const take = async () => {
    setConfirming(true);
    await flagAppointment(params.id, 2).then(response => {
      if (response)
        router.back();
      setConfirming(false);
    });
  };

  const confirm = async () => {
    setConfirming(true);
    await flagAppointment(params.id, 3).then(response => {
      if (response)
        router.back();
      setConfirming(false);
    });
  };

  const complete = async () => {
    setCompleting(true);
    await flagAppointment(params.id, 6).then(response => {
      if (response)
        router.back();
      setCompleting(false);
    });
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

        { (user?.rol === "10" || params.cancelado || params.confirmado || params.completado) &&
          <View>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Correo de usuario: {user?.rol === "10" ? params.user_correo : user?.correo}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Fecha y hora: {params.fecha.split('.')[0].split('T')[0]} {params.fecha.split('.')[0].split('T')[1]}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Ciudad: {params.ciudad}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Dirección de cita: {params.direccion}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Patente de auto: {params.patente}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              VIN de auto: {params.vin}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Marca de auto: {params.marca}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Modelo de auto: {params.modelo}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Detalles de auto o cita: {params.detalles}
            </Text>
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Tipo de servicio: {params.servicio === "01" ? "Cliente lleva a taller" : params.servicio === "00" ? "Atención a domicilio" : params.servicio === "00" ? "Mecánico lleva a taller" : "Indefinido"}
            </Text>
            {params.id_taller &&
              <Text style={[styles.subtitleText, {textAlign: "left"}]}>
                Detalles de taller: {params.nombre}: {params.taller_direccion}
              </Text>
            }
            <Text style={[styles.subtitleText, {textAlign: "left"}]}>
              Mech: {user?.id == params.id_mech ? user?.nombre : params.id_mech ? params.mech_correo : "Sin mech"}
            </Text>
          </View>
        }

        { user?.id == params.id_usuario && !(params.cancelado || params.confirmado || params.completado) &&
          <View>
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
            <View style={{paddingVertical: 16}}>
              <Text style={styles.subtitleText}>Auto:</Text>
              <Text style={styles.subtitleText}>
                Patente: {params.patente}, VIN: {params.vin}
              </Text>
              <Text style={styles.subtitleText}>
                Marca: {params.marca}, Modelo: {params.modelo}
              </Text>
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
                    labelField="correo"
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
          </View>
        }

        <View style={{alignSelf: "center", flexDirection: "row", justifyContent: "space-between", paddingBottom: 40, paddingTop: 16}}>
          { (user?.id == params.id_usuario || params.confirmado) && !params.cancelado &&
            <CustomButton
              title="Cancelar"
              handlePress={cancel}
              buttonStyles={styles.mainButton}
              isLoading={isCancelling}
            />
          }
          {!(params.cancelado || params.confirmado || params.completado) && user?.id == params.id_usuario &&
            <CustomButton
              title="Actualizar"
              handlePress={submit}
              buttonStyles={styles.mainButton}
              isLoading={isSubmitting}
            />
          }
          { user?.rol === "10" &&
          <>
            { params.confirmado ?
              <CustomButton
                title="Completar"
                handlePress={complete}
                buttonStyles={styles.mainButton}
                isLoading={isCompleting}
              />
              :
              <>
                { params.id_mech ?
                  <CustomButton
                    title="Confirmar"
                    handlePress={confirm}
                    buttonStyles={styles.mainButton}
                    isLoading={isConfirming}
                  />
                  :
                  <CustomButton
                    title="Tomar cita"
                    handlePress={take}
                    buttonStyles={styles.mainButton}
                    isLoading={isConfirming}
                  />
                }
              </>
            }
          </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
