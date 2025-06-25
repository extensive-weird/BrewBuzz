/**
 * BusinessSplashScreenStyles.ts
 *
 * Styles for the Business Onboarding Splash Screen
 *
 * This file contains all styling for the business profile splash screen,
 * using responsive sizing to ensure proper display across different devices.
 */

import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const colors = {
  background: "#FFF8F0",
  primary: "#5E3023",
  secondary: "#7D5A50",
  text: {
    primary: "#5E3023",
    secondary: "#8C6E63",
    light: "#FFF",
  },
  card: "#FFF",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: wp(5),
    alignItems: "center",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: hp(2),
  },
  mainImage: {
    width: wp(80),
    height: hp(30),
    resizeMode: "contain",
  },
  titleText: {
    fontSize: wp(7),
    fontWeight: "700",
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: hp(1),
  },
  subtitleText: {
    fontSize: wp(4),
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: hp(3),
    lineHeight: wp(5.5),
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: hp(3),
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  benefitIcon: {
    fontSize: wp(8),
    marginRight: wp(3),
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: colors.text.primary,
  },
  benefitDescription: {
    fontSize: wp(3.5),
    color: colors.text.secondary,
    marginTop: hp(0.5),
  },
  buttonContainer: {
    width: "100%",
  },
  gradientButton: {
    borderRadius: wp(3),
    padding: wp(4),
    alignItems: "center",
    marginBottom: hp(1),
  },
  buttonText: {
    color: colors.text.light,
    fontWeight: "700",
    fontSize: wp(4.5),
  },
  footerText: {
    fontSize: wp(3.5),
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: hp(4),
  },
});
