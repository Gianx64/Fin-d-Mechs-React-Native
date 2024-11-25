import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../../constants";

export default () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{padding: 10}}>
        <Text style={styles.titleText}>Futuro mapa</Text>
      </View>
    </SafeAreaView>
  );
};
