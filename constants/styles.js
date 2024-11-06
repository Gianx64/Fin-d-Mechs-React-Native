import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
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
    paddingTop: 32,
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
    backgroundColor: colors.primary[100],
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
    color: colors.primary.DEFAULT,
    fontSize: 16,
    paddingVertical: 16
  },
  formField: {
    color: "white",
    backgroundColor: colors.gray,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 20,
    height: 50,
    textAlign: "center"
  },
  tinyLogo: {
    height: 90,
    width: 150
  },
});