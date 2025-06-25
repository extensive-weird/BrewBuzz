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
  link: "#C67C4E",
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
    marginTop: hp("5%"),
    marginBottom: hp("4%"),
  },
  logo: {
    width: wp("30%"),
    height: wp("30%"),
    resizeMode: "contain",
    marginBottom: hp("2%"),
  },
  headerText: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: colors.text,
    marginBottom: hp("1%"),
  },
  subHeaderText: {
    fontSize: wp("4%"),
    color: colors.lightText,
    textAlign: "center",
    marginHorizontal: wp("10%"),
  },
  formContainer: {
    width: "100%",
    marginTop: hp("4%"),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    marginBottom: hp("3%"),
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
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: wp("3%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },
  footerContainer: {
    marginTop: hp("10%"),
    marginBottom: hp("3%"),
  },
  backToSignInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("3%"),
  },
  backToSignInText: {
    color: colors.link,
    fontSize: wp("4%"),
    marginLeft: wp("1%"),
  },
  createAccountContainer: {
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
