import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Add these new styles to your ReviewPageStyles.ts file

  reviewCard: {
    marginVertical: 16,
    backgroundColor: "#FFF",
    padding: 0,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  reviewCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  userInfoContainer: {
    flex: 1,
    marginLeft: 12,
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F5F5",
  },

  myReviewAvatar: {
    borderWidth: 2,
    borderColor: "#FF944D",
  },

  username: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 2,
  },

  myReviewUsername: {
    color: "#FF944D",
  },

  reviewDate: {
    fontSize: 12,
    color: "#999",
  },

  ratingBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },

  ratingNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF944D",
    marginTop: 2,
  },

  reviewContentContainer: {
    padding: 16,
    paddingTop: 12,
  },

  comment: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  myReviewCard: {
    borderLeftWidth: 0,
    borderTopWidth: 3,
    borderTopColor: "#FF944D",
    backgroundColor: "#FFF8F3",
  },

  myReviewIndicator: {
    position: "absolute",
    top: -10,
    right: 15,
    backgroundColor: "#FF944D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  myReviewIndicatorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  reviewActionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    borderEndEndRadius: 16,
    borderStartEndRadius: 16,
    overflow: "hidden",
  },

  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },

  deleteButton: {
    borderLeftWidth: 1,
    borderLeftColor: "#F0F0F0",
  },

  actionButtonText: {
    fontWeight: "600",
    color: "#555",
    fontSize: 14,
  },

  stars: {
    fontSize: 16,
    color: "#FFD700",
    letterSpacing: 2,
  },

  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  summarySection: {
    alignItems: "center",
    marginVertical: 20,
  },
  averageScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FF944D",
  },

  totalReviews: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
  },
  breakdownSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  breakdownLabel: {
    width: 40,
    fontSize: 16,
    color: "#555",
  },
  breakdownBar: {
    flex: 1,
    backgroundColor: "#EEE",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginRight: 10,
  },
  breakdownFill: {
    backgroundColor: "#FF944D",
    height: 8,
  },
  breakdownCount: {
    width: 30,
    fontSize: 14,
    color: "#777",
    textAlign: "right",
  },
  reviewList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noReviews: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editButton: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 15,
    padding: 5,
  },

  newReviewButton: {
    margin: 20,
    backgroundColor: "#FF944D",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  newReviewText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  starPicker: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalStar: {
    fontSize: 32,
    marginHorizontal: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: "#FF944D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#EEE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
    fontSize: 16,
  },

  reviewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },

  editReviewButton: {
    backgroundColor: "#4CAF50", // green color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 5,
  },

  deleteReviewButton: {
    backgroundColor: "#F44336", // red color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft: 5,
  },
  usernameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
