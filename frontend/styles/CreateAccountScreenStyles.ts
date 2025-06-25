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
  error: "#FF5252",
  success: "#4CAF50",
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
  },
  logoContainer: {
    alignItems: "center",
    marginTop: hp("2%"),
    marginBottom: hp("2%"),
  },
  logo: {
    width: wp("30%"),
    height: wp("30%"),
    resizeMode: "contain",
  },
  headerText: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: colors.text,
    marginTop: hp("1%"),
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    marginVertical: hp("2%"),
    padding: wp("1%"),
  },
  toggleButton: {
    flex: 1,
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    borderRadius: wp("2.5%"),
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: wp("3.8%"),
    fontWeight: "500",
    color: colors.lightText,
  },
  activeToggleText: {
    color: colors.background,
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
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp("2%"),
  },
  stateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    height: hp("7%"),
    borderWidth: 1,
    borderColor: colors.border,
    flex: 0.63,
  },
  zipcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("4%"),
    height: hp("7%"),
    borderWidth: 1,
    borderColor: colors.border,
    flex: 0.35,
  },
  stateText: {
    flex: 1,
    fontSize: wp("4%"),
  },
  selectedStateText: {
    color: colors.text,
  },
  placeholderStateText: {
    color: "#999",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2%"),
  },

  createButton: {
    backgroundColor: colors.primary,
    borderRadius: wp("3%"),
    height: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("2%"),
  },
  createButtonText: {
    color: colors.background,
    fontSize: wp("4.5%"),
    fontWeight: "600",
  },
  footerContainer: {
    alignItems: "center",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
  },
  footerText: {
    fontSize: wp("3.5%"),
    color: colors.lightText,
  },
  signInText: {
    color: colors.link,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: wp("5%"),
    borderTopRightRadius: wp("5%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("3%"),
    maxHeight: hp("70%"),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    color: colors.text,
  },
  stateList: {
    marginTop: hp("1%"),
  },
  stateItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp("1.8%"),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedStateItem: {
    backgroundColor: `${colors.primary}10`,
  },
  stateItemText: {
    fontSize: wp("4%"),
    color: colors.text,
  },
  selectedStateItemText: {
    color: colors.primary,
    fontWeight: "500",
  },
  policyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#C67C4E",
    borderColor: "#C67C4E",
  },
  checkmark: {
    color: "#fff",
    fontWeight: "bold",
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  policyLink: {
    color: "#C67C4E",
    fontWeight: "600",
  },
});

export default styles;
