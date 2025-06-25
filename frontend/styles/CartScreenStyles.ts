import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    textAlign: "center",
  },
  businessGroup: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  shopInfo: {
    marginBottom: 12,
  },
  shopName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  shopAddress: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  cartItem: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 12,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  itemPrice: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  quantityAndRemoveContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    padding: 6,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  quantityNumber: {
    fontSize: 16,
    marginHorizontal: 8,
    color: "#333",
  },
  removeButton: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#FFEAEA",
  },
  removeButtonText: {
    fontSize: 12,
    color: "#FF5C5C",
  },
  businessGroupFooter: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderButton: {
    marginTop: 8,
    borderRadius: 7,
    backgroundColor: "#C67C4E",
  },
  clearButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF5C5C",
  },
    modifierList: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});


export default styles;
