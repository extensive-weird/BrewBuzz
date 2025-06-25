import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5, // for Android shadow
  },
  itemCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  viewCartButton: {
    backgroundColor: '#C67C4E', // Theme color consistent with your app
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  viewCartButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
