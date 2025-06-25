import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("6%"),
    paddingVertical: hp("2%"),
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333333",
  },
  infoButton: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("6%"),
    paddingBottom: hp("8%"),
  },
  pointsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: wp("5%"),
    marginTop: hp("2%"),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pointsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp("1.5%"),
  },
  pointsLabel: {
    fontSize: wp("3.5%"),
    color: "#666666",
    marginBottom: 4,
  },
  pointsText: {
    fontSize: wp("10%"),
    fontWeight: "bold",
    color: "#C67C4E",
  },
  coffeeBeanIcon: {
    width: wp("12%"),
    height: wp("12%"),
    borderRadius: wp("6%"),
    backgroundColor: "#FFF8F3",
    justifyContent: "center",
    alignItems: "center",
  },
  nextMilestone: {
    marginBottom: hp("2%"),
  },
  nextMilestoneText: {
    fontSize: wp("3.5%"),
    color: "#666666",
    fontStyle: "italic",
  },
  progressContainer: {
    marginTop: hp("1%"),
  },
  progressBar: {
    height: hp("1.2%"),
    borderRadius: hp("0.6%"),
    backgroundColor: "#EEEEEE",
  },
  milestonesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("1%"),
    paddingHorizontal: wp("1%"),
  },
  milestoneMarker: {
    alignItems: "center",
  },
  milestoneCircle: {
    width: wp("2.5%"),
    height: wp("2.5%"),
    borderRadius: wp("1.25%"),
    backgroundColor: "#DDDDDD",
    marginBottom: 4,
  },
  milestoneCircleActive: {
    backgroundColor: "#C67C4E",
  },
  milestoneText: {
    fontSize: wp("3%"),
    color: "#999999",
  },
  milestoneTextActive: {
    color: "#C67C4E",
    fontWeight: "bold",
  },
  rewardsSection: {
    marginTop: hp("3%"),
  },
  sectionTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333333",
    marginBottom: hp("2%"),
  },
  rewardsList: {
    gap: hp("2%"),
  },
  rewardCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rewardCardUnlocked: {
    backgroundColor: "#FFFFFF",
  },
  rewardCardLocked: {
    backgroundColor: "#F5F5F5",
  },
  rewardImageContainer: {
    width: wp("25%"),
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  lockOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    width: "100%",
    height: "100%",
  },
  rewardContent: {
    flex: 1,
    padding: wp("4%"),
    justifyContent: "space-between",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: wp("2%"),
    right: wp("2%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.5%"),
    borderRadius: wp("5%"),
  },
  badgeUnlocked: {
    backgroundColor: "#C67C4E",
  },
  badgeLocked: {
    backgroundColor: "#AAAAAA",
  },
  badgeText: {
    fontSize: wp("3%"),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  rewardTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    marginBottom: hp("0.5%"),
  },
  rewardDescription: {
    fontSize: wp("3.5%"),
    marginBottom: hp("1%"),
  },
  rewardStatus: {
    fontSize: wp("3%"),
    fontStyle: "italic",
  },
  textUnlocked: {
    color: "#333333",
  },
  textLocked: {
    color: "#888888",
  },
  statusUnlocked: {
    color: "#C67C4E",
    fontWeight: "bold",
  },
  statusLocked: {
    color: "#AAAAAA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7D7D7D",
  },
  noRewardsText: {
    fontSize: 16,
    color: "#8C8C8C",
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
});

export default styles;
