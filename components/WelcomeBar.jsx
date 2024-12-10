import { Image, Text, View } from "react-native";
import { icons, styles } from "../constants";
import { useGlobalContext } from "../api/GlobalProvider";

const WelcomeBar = () => {
  const { user } = useGlobalContext();
  return (
    <View style={{flexDirection: "row", justifyContent: "space-between"}}>
      <View>
        <Text style={styles.normalText}>
          Bienvenid@ de vuelta
        </Text>
        <Text style={{color: "white", fontSize: 16}}>
          {user?.nombre}
        </Text>
      </View>
      <View>
        <Image
          source={icons.logo}
          style={[styles.tinyLogo, {alignSelf: "flex-end"}]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default WelcomeBar;