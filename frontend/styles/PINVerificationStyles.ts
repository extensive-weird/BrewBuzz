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
  success: "#4CAF50",
  disabled: "#CCCCCC",
  error: "#FF5252",
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
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("3%"),
  },
  logo: {
    width: wp("30%"),
    height: wp("30%"),
    resizeMode: "contain",
    marginBottom: hp("2%"),
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: colors.text,
    marginBottom: hp("1%"),
    textAlign: "center",
  },
  subtitle: {
    fontSize: wp("3.8%"),
    color: colors.lightText,
    textAlign: "center",
    marginHorizontal: wp("10%"),
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: hp("3%"),
  },
  pinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: hp("3%"),
  },
  pinInput: {
    width: wp("15%"),
    height: wp("15%"),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: wp("2%"),
    fontSize: wp("7%"),
    textAlign: "center",
    backgroundColor: colors.inputBg,
  },
  pinInputFilled: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  pinInputDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  loadingText: {
    marginLeft: wp("2%"),
    color: colors.primary,
    fontSize: wp("3.5%"),
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
  },
  resendText: {
    color: colors.lightText,
    fontSize: wp("3.5%"),
    marginRight: wp("1%"),
  },
  resendButton: {
    padding: wp("1%"),
  },
  resendLink: {
    color: colors.primary,
    fontSize: wp("3.5%"),
    fontWeight: "bold",
  },
  resendLinkDisabled: {
    color: colors.disabled,
  },
  passwordContainer: {
    width: "100%",
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
  passwordRequirements: {
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    padding: wp("4%"),
    marginTop: hp("1%"),
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
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: wp("3%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footerContainer: {
    marginTop: hp("3%"),
    marginBottom: hp("3%"),
    alignItems: "center",
  },
  backToSignInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  backToSignInText: {
    color: colors.primary,
    fontSize: wp("4%"),
    marginLeft: wp("1%"),
  },
  privacyContainer: {
    marginTop: hp("2%"),
  },
  privacyText: {
    color: colors.lightText,
    fontSize: wp("3.5%"),
  },
});
