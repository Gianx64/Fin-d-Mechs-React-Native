import { Dimensions, StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flex: 1
  },
  welcomeLogo: {
    alignItems: "center",
    height: 200,
    paddingVertical: 130,
    width: "auto"
  },
  welcomeText1: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    paddingVertical: 16,
    textAlign: "center"
  },
  titleText: {
    color: "white",
    fontSize: 22,
    paddingVertical: 16,
    textAlign: "center"
  },
  subtitleText: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 16,
    textAlign: "center"
  },
  normalText: {
    color: colors.gray,
    fontSize: 16,
    paddingVertical: 16
  },
  mainButton: {
    alignSelf: "center",
    backgroundColor: colors.primary[100],
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 64,
    zIndex: 1
  },
  normalButton: {
    alignSelf: "center",
    backgroundColor: colors.primary[100],
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 1
  },
  buttonText: {
    color: "white",
    fontSize: 16
  },
  linkText: {
    color: colors.primary.DEFAULT,
    fontSize: 16,
    paddingVertical: 16
  },
  loader: {
    alignSelf: "center",
    backgroundColor: colors.secondary+"50",
    height: Dimensions.get("window").height+20,
    position: "absolute",
    width: Dimensions.get("window").width
  },
  formField: {
    color: "black",
    backgroundColor: colors.gray,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 20,
    height: 50,
    textAlign: "center",
    textAlignVertical: "center"
  },
  tinyLogo: {
    height: 90,
    width: 150
  },
});