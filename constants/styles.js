import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
    padding: 10
  },
  welcomeLogo: {
    alignItems: "center",
    height: 200,
    paddingVertical: 130,
    width: "auto"
  },
  welcomeText1: {
    color: "white",
    fontWeight: 'bold',
    fontSize: 32,
    textAlign: 'center'
  },
  titleText: {
    color: "white",
    fontSize: 20,
    textAlign: 'center'
  },
  subtitleText: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 16,
    textAlign: 'center'
  },
  normalText: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 16
  },
  mainButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary[100],
    borderRadius: 16,
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 64,
    zIndex: 1,
  },
  buttonText: {
    color: "black",
    fontSize: 16
  },
  linkText: {
    color: colors.secondary.DEFAULT,
    fontSize: 16,
    paddingVertical: 16
  },
  formField: {
    flexDirection:'row',
    justifyContent:'center'
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
});