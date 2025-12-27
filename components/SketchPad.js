import React, { useMemo, useState } from 'react';
import { View, Text, PanResponder, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

function pointsToPath(points) {
  if (points.length === 0) return '';
  const first = points[0];
  let d = `M ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
}
const SketchPad = () => {
  const [strokes, setStrokes] = useState([]);
  const [current, setCurrent] = useState([]);
  console.log(Path);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: e => {
          const { locationX, locationY } = e.nativeEvent;
          setCurrent([{ x: locationX, y: locationY }]);
        },
        onPanResponderMove: e => {
          const { locationX, locationY } = e.nativeEvent;
          setCurrent(prev => [...prev, { x: locationX, y: locationY }]);
        },
        onPanResponderRelease: e => {
          setStrokes(prev => (current.length ? [...prev, current] : prev));
          setCurrent([]);
        },
      }),
    [current],
  );
  return (
    <View
      {...panResponder.panHandlers}
      style={{ margin: 20, height: 400, borderWidth: 2, borderColor: 'black' }}
    >
      <Svg style={StyleSheet.absoluteFill}>
        {strokes.map((pts, i) => (
          <Path
            key={i}
            d={pointsToPath(pts)}
            stroke="black"
            strokeWidth={4}
            fill="none"
          ></Path>
        ))}
        <Path
          d={pointsToPath(current)}
          stroke="black"
          fill="none"
          strokeWidth={4}
        ></Path>
      </Svg>
    </View>
  );
};
export default SketchPad;
