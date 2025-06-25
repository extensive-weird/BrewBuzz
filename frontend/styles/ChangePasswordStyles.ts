import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const colors = {
  primary: "#C67C4E",
  background: "#FFFFFF",
  text: "#333333",
  lightText: "#666666",
  inputBg: "#F5F5F5",
  border: "#E0E0E0",
  success: "#C67C4E",
  divider: "#EEEEEE",
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: wp("6%"),
  },
  instructionText: {
    fontSize: wp("3.8%"),
    color: colors.lightText,
    marginBottom: hp("3%"),
    lineHeight: wp("5.5%"),
  },
  formContainer: {
    marginBottom: hp("3%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    marginBottom: hp("2%"),
    paddingHorizontal: wp("4%"),
    height: hp("7%"),
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: wp("2%"),
  },
  input: {
    flex: 1,
    fontSize: wp("4%"),
    color: colors.text,
  },
  eyeIconContainer: {
    padding: wp("2%"),
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: hp("2%"),
  },
  passwordRequirements: {
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginBottom: hp("3%"),
  },
  requirementsTitle: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
    color: colors.text,
    marginBottom: hp("1%"),
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  requirementText: {
    fontSize: wp("3.5%"),
    color: colors.lightText,
    marginLeft: wp("2%"),
  },
  updateButton: {
    backgroundColor: colors.primary,
    borderRadius: wp("3%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },
});
