import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import Header from './components/Header';
import SketchPad from './components/SketchPad';

export default function App() {
  return (
    <SafeAreaView>
      <Header></Header>
      <SketchPad></SketchPad>
    </SafeAreaView>
  );
}
