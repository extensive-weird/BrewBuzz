import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%', 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 0,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
    tintColor: '#C67C4E',
  },
  emailText: {
    fontSize: 14,
    color: '#7D7D7D',
  },
  options: {
    alignItems: 'center',
    marginVertical: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#C67C4E',
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
});
