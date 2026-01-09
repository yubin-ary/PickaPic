import React from 'react';
import { View, Image, StyleSheet, FlatList } from 'react-native';

const ResultGrid = ({ uris }) => {
  if (!Array.isArray(uris) || uris.length === 0) {
    return null;
  }
  return (
    <FlatList
      data={uris}
      keyExtractor={(uri, index) => `${uri}-${index}`}
      numColumns={2}
      contentContainerStyle={style.grid}
      columnWrapperStyle={style.row}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={style.item} resizeMode="cover" />
      )}
    />
  );
};

const style = StyleSheet.create({
  grid: {
    padding: 12,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  item: {
    width: '49%',
    aspectRatio: 1,
    borderRadius: 6,
  },
});

export default ResultGrid;
