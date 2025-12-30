import { View, Text } from 'react-native';
const Header = () => (
  <View
    style={{
      marginTop: '50',
      height: '100',

      flex: '1',
      justifyContent: 'center',
    }}
  >
    <Text style={{ textAlign: 'center', fontSize: 50 }}>PickaPic!</Text>
  </View>
);
export default Header;
