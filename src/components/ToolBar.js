import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ToolBar = ({ handleMode, refresh, handleSearch }) => {
  const toggleDraw = () => {
    handleMode('draw');
  };
  const toggleErase = () => {
    handleMode('erase');
  };
  const onRefresh = () => {
    refresh();
  };
  const onSearch = () => {
    handleSearch();
  };
  return (
    <View style={style.style1}>
      <Pressable onPress={toggleDraw} style={{ flex: 1 }}>
        <Text style={{ fontSize: 35, textAlign: 'left' }}>🖊️</Text>
      </Pressable>
      <Pressable onPress={toggleErase} style={{ flex: 1 }}>
        <Text style={{ fontSize: 35, textAlign: 'center' }}>🧽</Text>
      </Pressable>
      <Pressable onPress={onRefresh} style={{ flex: 1 }}>
        <Text style={{ fontSize: 35, textAlign: 'right' }}>⌫</Text>
      </Pressable>
      <Pressable onPress={onSearch} style={{ flex: 3.5 }}>
        <Text style={{ fontSize: 35, textAlign: 'right' }}>🔍</Text>
      </Pressable>
    </View>
  );
};
const style = StyleSheet.create({
  style1: {
    display: 'flex',
    flexDirection: 'row',
    margin: 35,
    marginTop: 0,
    height: 50,
  },
});
export default ToolBar;
