import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../constants";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  buttonStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <View style={containerStyles}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={[styles.mainButton, buttonStyles, isLoading ? {opacity: 50} : {}]}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, textStyles]}>
          {title}
        </Text>

        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
