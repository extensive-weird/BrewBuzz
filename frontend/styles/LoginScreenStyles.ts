import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const colors = {
  primary: "#C67C4E", // A nice purple color for the primary elements
  background: "#FFFFFF",
  text: "#333333",
  lightText: "#666666",
  inputBg: "#F5F5F5",
  border: "#E0E0E0",
  link: "#C67C4E",
};

const styles = StyleSheet.create({
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
    marginTop: hp("5%"),
    marginBottom: hp("4%"),
  },
  logo: {
    width: wp("70%"),
    height: wp("70%"),
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: colors.text,
    marginBottom: hp("1%"),
  },
  subtitleText: {
    fontSize: wp("4%"),
    color: colors.lightText,
  },
  formContainer: {
    width: "100%",
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: hp("3%"),
  },
  forgotPasswordText: {
    color: colors.link,
    fontSize: wp("3.5%"),
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: wp("3%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  footerContainer: {
    marginBottom: hp("3%"),
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  noAccountText: {
    color: colors.lightText,
    fontSize: wp("3.5%"),
  },
  createAccountText: {
    color: colors.link,
    fontSize: wp("3.5%"),
    fontWeight: "bold",
  },
  privacyContainer: {
    alignItems: "center",
  },
  privacyText: {
    color: colors.lightText,
    fontSize: wp("3.5%"),
  },
});

export default styles;
