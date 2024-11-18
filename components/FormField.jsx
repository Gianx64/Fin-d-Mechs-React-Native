import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from "react-native";

import { icons, styles } from "../constants";

const FormField = ({
  title,
  value,
  readOnly,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[{}, otherStyles]}>
      <Text style={styles.subtitleText}>{title}</Text>

      <View style={{flexDirection:'row', justifyContent:'center'}}>
        <TextInput
          style={[styles.formField, title === "Contraseña" ? {width: Dimensions.get("window").width-110} : {width: Dimensions.get("window").width-50}]}
          readOnly={readOnly}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="white"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Contraseña" && !showPassword}
          {...props}
        />

        {title === "Contraseña" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;