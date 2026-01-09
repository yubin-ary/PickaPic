import React from 'react';
import { SafeAreaView, Image, Text, ScrollView } from 'react-native';

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
      <ScrollView contentContainerStyle={{ padding: 12, gap: 12 }}>
        {Array.isArray(compareResult) &&
          compareResult.map((uri, i) => (
            <Image
              key={`${uri}-${i}`}
              source={{ uri }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
