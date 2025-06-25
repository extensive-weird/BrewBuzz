import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F5',
  },
  topSection: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',        
    height: '100%',       
    resizeMode: 'cover',  
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
    marginTop:10,
  },
  highlight: {
    color: '#FF8C00',
  },
  subtitle: {
    fontSize: 16,
    color: '#7D7D7D',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 50,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});