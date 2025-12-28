import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ToolBar = ({ handleMode, refresh }) => {
  const toggleDraw = () => {
    handleMode('draw');
  };
  const toggleErase = () => {
    handleMode('erase');
  };
  const onRefresh = () => {
    refresh();
  };
  return (
    <View style={style.style1}>
      <Pressable onPress={toggleDraw}>
        <Text style={{ fontSize: 35, marginRight: 20, marginLeft: 10 }}>
          🖊️
        </Text>
      </Pressable>
      <Pressable onPress={toggleErase}>
        <Text style={{ fontSize: 35, marginRight: 20 }}>🧽</Text>
      </Pressable>
      <Pressable onPress={onRefresh}>
        <Text style={{ fontSize: 35 }}>⌫</Text>
      </Pressable>
    </View>
  );
};
const style = StyleSheet.create({
  style1: {
    display: 'flex',
    flexDirection: 'row',

    margin: 20,
    marginTop: 0,
    height: 50,
  },
});
export default ToolBar;
