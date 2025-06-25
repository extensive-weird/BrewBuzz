import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingTop: -100,
    paddingBottom:-30,
    width: '100%', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 40,
  },
  backArrow: {
    left: 10,
    right: 40,
    zIndex: 10,
  },
  backArrowImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#C67C4E',
    fontFamily: 'Sora',
    paddingBottom: 10,
  },
  notificationIcon: {
    width: 40,
    alignItems: 'flex-end',
  },
  notificationIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 80, 
  },
  businessCard: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 15,
    elevation: 3,
  },
  businessImage: {
    width: '100%',
    height: 220,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C67C4E',
    fontFamily: 'Sora',
  },
  businessAddress: {
    fontSize: 14,
    color: '#FFF',
  },
  addBusinessText: {
    fontSize: 16,
    color: '#C67C4E',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 10,
    textAlign: 'center', 
  },
});

export default styles;
