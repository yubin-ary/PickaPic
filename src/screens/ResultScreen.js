import React from 'react';
import { SafeAreaView, Image, Text, ScrollView } from 'react-native';
import ResultGrid from '../components/ResultGrid.js';

export default function ResultScreen({ route }) {
  const { img, compareResult } = route.params ?? {};

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
      <ScrollView>
        <ResultGrid uris={compareResult} />
      </ScrollView>
    </SafeAreaView>
  );
}
