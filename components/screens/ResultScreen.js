import React from 'react';
import { SafeAreaView, Image, Text } from 'react-native';

export default function ResultScreen({ route }) {
  const { img } = route.params ?? {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={{ padding: 12 }}>ResultScreen</Text>
      {!!img && (
        <Image
          source={{ uri: img }}
          style={{ width: '100%', height: 300 }}
          resizeMode="contain"
        />
      )}
    </SafeAreaView>
  );
}
